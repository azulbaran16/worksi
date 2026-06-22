#!/usr/bin/env python3
"""Generate an image via Google Gemini (Nano Banana Pro) and save it as PNG.

Usage:
  python tools/genimg.py "<prompt>" <output_path> [aspect] [model]

aspect: 1:1, 16:9, 4:3, 3:4, 9:16, 21:9 ...  (default 16:9)
model:  gemini-3-pro-image (default) | gemini-2.5-flash-image
Requires env var GEMINI_API_KEY (or GOOGLE_API_KEY).
"""
import base64
import json
import os
import sys
import urllib.request
import urllib.error

API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")


def generate(prompt, out_path, aspect="16:9", model="gemini-3-pro-image"):
    if not API_KEY:
        sys.exit("ERROR: set GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": aspect},
        },
    }
    data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            payload = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read().decode()[:500]}")

    parts = payload.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    for p in parts:
        inline = p.get("inlineData") or p.get("inline_data")
        if inline and inline.get("data"):
            os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(inline["data"]))
            print(f"OK {out_path}")
            return
    sys.exit(f"No image returned. Response: {json.dumps(payload)[:600]}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    prompt = sys.argv[1]
    out = sys.argv[2]
    aspect = sys.argv[3] if len(sys.argv) > 3 else "16:9"
    model = sys.argv[4] if len(sys.argv) > 4 else "gemini-3-pro-image"
    generate(prompt, out, aspect, model)
