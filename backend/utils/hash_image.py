"""hash_image.py

Generate a deterministic 'hash image' (SVG) from an arbitrary input string.
The pipeline:
  1. SHA-256 hash of the input to get 32 bytes with strong avalanche.
  2. Use portions of the hash to seed a small SplitMix64 PRNG.
  3. Procedurally emit an SVG composed of shapes (circles, rects, polylines)
     whose properties are derived from successive PRNG outputs. This produces
     a visually diverse image space; similar inputs yield unrelated images.

Functions:
  hash_to_svg(text: str, size: int = 120) -> str
      Return an SVG string.
  save_svg(text: str, path: str | Path, size: int = 120) -> Path
      Convenience helper to write SVG to disk atomically.

Notes:
  - The full SHA-256 hex is embedded in a <desc> tag & data-hash attribute.
  - Deterministic & side-effect free aside from save_svg writing output.
  - Not intended for security-critical fingerprinting; purely aesthetic.
"""
from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
from pathlib import Path
import os
from typing import Callable, List

# ---- PRNG (SplitMix64) ----------------------------------------------------

def _splitmix64(seed: int) -> Callable[[], float]:
    """Return a deterministic PRNG function yielding floats in [0,1).

    SplitMix64 adapted to Python integers. We mask to 64 bits after each
    multiplication to emulate unsigned overflow.
    """
    mask = (1 << 64) - 1
    x = seed & mask

    def rnd() -> float:
        nonlocal x
        x = (x + 0x9E3779B97F4A7C15) & mask
        z = x
        z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9 & mask
        z = (z ^ (z >> 27)) * 0x94D049BB133111EB & mask
        z ^= z >> 31
        # Use top 53 bits for double precision fraction similar to JS approach
        return (z & ((1 << 53) - 1)) / float(1 << 53)

    return rnd

# ---- Helpers --------------------------------------------------------------

def _pick(rnd: Callable[[], float], a: float, b: float) -> float:
    return a + rnd() * (b - a)

def _pick_int(rnd: Callable[[], float], a: int, b: int) -> int:
    return int(_pick(rnd, a, b + 1))

@dataclass
class _Palette:
    background: str
    colors: List[str]
    gradient_id: str

# ---- Core Generation ------------------------------------------------------

def _derive_seed(hash_hex: str) -> int:
    # Use first 16 hex chars (64 bits) as seed
    return int(hash_hex[:16], 16)

def _build_palette(rnd: Callable[[], float], hash_hex: str) -> _Palette:
    base_hue = _pick(rnd, 0, 360)
    bg_h = int(base_hue) % 360
    bg_s = int(_pick(rnd, 30, 70))
    bg_l = int(_pick(rnd, 12, 28))
    background = f"hsl({bg_h} {bg_s}% {bg_l}%)"

    colors: List[str] = []
    for i in range(5):
        h = (base_hue + (i + 1) * _pick(rnd, 40, 75)) % 360
        s = _pick(rnd, 45, 85)
        l = _pick(rnd, 35, 70)
        colors.append(f"hsl({int(h)} {int(s)}% {int(l)}%)")

    gradient_id = f"g{hash_hex[:8]}"
    return _Palette(background, colors, gradient_id)

def hash_to_svg(text: str, size: int = 120) -> str:
    """Generate an SVG image deterministically from input text.

    Args:
        text: Arbitrary string.
        size: Viewbox square dimension (default 120).
    Returns:
        SVG XML string.
    """
    if not isinstance(text, str):  # defensive
        raise TypeError("text must be str")

    h = sha256(text.encode("utf-8")).hexdigest()
    seed = _derive_seed(h)
    rnd = _splitmix64(seed)
    palette = _build_palette(rnd, h)

    mode = _pick_int(rnd, 0, 2)  # which shape generator family
    shape_count = _pick_int(rnd, 6, 18)

    elements: List[str] = []
    # gradient definition
    gradient_stops = []
    for i, c in enumerate(palette.colors[:3]):
        offset = int((i / 2) * 100)
        gradient_stops.append(f'<stop offset="{offset}%" stop-color="{c}"/>')
    elements.append(
        f'<defs><linearGradient id="{palette.gradient_id}" x1="0" y1="0" x2="1" y2="1">' + "".join(gradient_stops) + '</linearGradient></defs>'
    )

    for _ in range(shape_count):
        cx = _pick(rnd, 0, size)
        cy = _pick(rnd, 0, size)
        rot = _pick(rnd, 0, 360)
        color = palette.colors[_pick_int(rnd, 0, len(palette.colors) - 1)]
        opacity = f"{_pick(rnd, 0.35, 0.95):.2f}"

        if mode == 0:  # circles
            r = _pick(rnd, size * 0.05, size * 0.28)
            fill = f'url(#{palette.gradient_id})' if rnd() < 0.4 else color
            elements.append(
                f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{fill}" opacity="{opacity}" transform="rotate({rot:.1f} {cx:.2f} {cy:.2f})" />'
            )
        elif mode == 1:  # rectangles
            w = _pick(rnd, size * 0.08, size * 0.5)
            h_rect = _pick(rnd, size * 0.08, size * 0.5)
            rx = _pick(rnd, 0, w / 2)
            elements.append(
                f'<rect x="{cx - w/2:.2f}" y="{cy - h_rect/2:.2f}" width="{w:.2f}" height="{h_rect:.2f}" rx="{rx:.2f}" fill="{color}" opacity="{opacity}" transform="rotate({rot:.1f} {cx:.2f} {cy:.2f})" />'
            )
        else:  # polylines
            pts = []
            for _ in range(5):
                px = _pick(rnd, 0, size)
                py = _pick(rnd, 0, size)
                pts.append(f"{px:.1f},{py:.1f}")
            stroke_width = _pick(rnd, 1, 4)
            elements.append(
                f'<polyline points="{' '.join(pts)}" fill="none" stroke="{color}" stroke-width="{stroke_width:.1f}" stroke-linecap="round" stroke-linejoin="round" opacity="{opacity}" />'
            )

        # occasional horizontal mirror of previous element for asymmetry variety
        if rnd() < 0.18:
            last = elements[-1]
            # naive mirror: swap any cx/x occurrences (approx). For simplicity we only mirror numeric attributes after =".
            def _mirror_numbers(svg_fragment: str) -> str:
                import re
                def repl(match: re.Match) -> str:
                    num = float(match.group(0))
                    mirrored = size - num
                    return f"{mirrored:.2f}"
                return re.sub(r"(?<=['\"])(\d+\.?\d*)(?=[ ,])", repl, svg_fragment)
            elements.append(_mirror_numbers(last))

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" data-hash="{h}" data-mode="{mode}" data-shapes="{shape_count}">'
        f'<rect width="100%" height="100%" fill="{palette.background}" />'
        + "".join(elements) +
        f'<desc>Derived from SHA-256: {h}</desc>'
        '</svg>'
    )
    return svg

# ---- Public Save Helper ---------------------------------------------------

def save_svg(text: str, path: str | Path, size: int = 120) -> Path:
    """Generate and write SVG to path. Ensures directory exists. Atomic write."""
    svg = hash_to_svg(text, size=size)
    out_path = Path(path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = out_path.with_suffix(out_path.suffix + ".tmp")
    tmp_path.write_text(svg, encoding="utf-8")
    os.replace(tmp_path, out_path)
    return out_path

__all__ = ["hash_to_svg", "save_svg"]
