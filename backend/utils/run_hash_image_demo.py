"""Manual demo for hash_image.
Run: uv run python backend/utils/run_hash_image_demo.py "Some Text" output.svg
"""
from __future__ import annotations
import sys
from pathlib import Path

# Support running either as module (-m backend.utils.run_hash_image_demo) or as a plain script
try:  # pragma: no cover - import resolution branch
    from .hash_image import save_svg  # type: ignore
except ImportError:  # direct script invocation path
    # Add repo root (two levels up: project/backend/utils -> project)
    ROOT = Path(__file__).resolve().parents[2]
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))
    from backend.utils.hash_image import save_svg  # type: ignore

def main():
    if len(sys.argv) < 3:
        print("Usage: python -m backend.utils.run_hash_image_demo <text> <output_path.svg>")
        return 1
    text = sys.argv[1]
    out = Path(sys.argv[2])
    save_svg(text, out)
    print(f"Wrote SVG to {out} ({out.stat().st_size} bytes)")
    return 0

if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
