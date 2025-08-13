"""Tests for hash_image module.

Covers:
  - Determinism: same input -> identical SVG
  - Difference: different inputs -> (likely) different SVG (not guaranteed but extremely likely)
  - save_svg writes file & content matches hash_to_svg
"""
from backend.utils.hash_image import hash_to_svg, save_svg
from pathlib import Path

def test_determinism():
    s1 = hash_to_svg("example")
    s2 = hash_to_svg("example")
    assert s1 == s2

def test_difference():
    a = hash_to_svg("alpha")
    b = hash_to_svg("beta")
    assert a != b  # probabilistic; acceptable risk extremely low

def test_save_svg(tmp_path: Path):
    out = tmp_path / "hash_image.svg"
    svg_inline = hash_to_svg("persist")
    save_svg("persist", out)
    assert out.read_text(encoding="utf-8") == svg_inline
