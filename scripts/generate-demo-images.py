"""
Generates AI demo product images for the 16 seeded DEMO products with FLUX.1
[schnell] via the public Hugging Face Space (no account needed; anonymous use
has a daily GPU quota — rerun later to fill in any gaps). Output:
public/products/{slug}-{1..3}.jpg, 3:4.

Then attach them in poshak-store-apis:
    npm run db:attach-images -- ../poshak-store-app/public/products

DEMO ONLY: replace with real photography before launch (the PDP promises
"photographed in daylight without filters").

    python scripts/generate-demo-images.py            # missing images only
    python scripts/generate-demo-images.py --force    # regenerate all

Alternative backend: set POLLINATIONS_TOKEN (an API key from pollinations.ai)
to use Pollinations instead (its anonymous tier is paywalled).
"""
import os
import io
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "public" / "products"
W, H = 768, 1024

STYLE = (
    "professional e-commerce fashion catalogue photograph, plain warm ivory studio background, "
    "soft natural daylight, sharp focus, high detail fabric texture, realistic, no text"
)
MODEL = "photo of a woman cropped from the chin down, face not visible, standing straight"

# slug: (outfit description, kind) — kind: stitched | unstitched
PRODUCTS = {
    "gulnar": ("mustard yellow lawn shalwar kameez with thread embroidered neckline and front, printed chiffon dupatta", "unstitched"),
    "noor": ("ivory white chikankari cotton kurti, straight cut, knee length, hand embroidered", "stitched"),
    "mahjabeen": ("sage green printed cambric two piece kameez with matching straight trousers", "stitched"),
    "zeenat": ("emerald green raw silk co-ord set, shirt with wide leg pants", "stitched"),
    "rania": ("deep navy blue digitally printed lawn kameez with dyed trousers", "unstitched"),
    "farasha": ("mustard embroidered organza semi formal shirt over silk slip with organza dupatta", "stitched"),
    "sitara": ("rust orange khaddar kurti with block print detailing at yoke and cuffs", "stitched"),
    "dilnaz": ("tea pink floor length chiffon maxi gown with sequin embellished sleeves", "stitched"),
    "mehr": ("sage green printed lawn fabric for a long kurti", "unstitched"),
    "ayesha": ("rust embroidered khaddar shalwar kameez with printed wool shawl", "unstitched"),
    "hania": ("deep blue printed lawn three piece shalwar kameez with dupatta and cigarette trousers", "stitched"),
    "shireen": ("emerald green hand embellished chiffon luxury formal shirt with zari bordered dupatta", "stitched"),
    "sana": ("sage green straight cambric trousers, plain, worn with a simple white kurti", "stitched"),
    "roshan": ("tea pink all over printed lawn shalwar kameez with printed chiffon dupatta", "unstitched"),
    "parveen": ("deep royal blue raw silk lehenga choli with hand embroidered choli and net dupatta", "stitched"),
    "bano": ("rust jacquard semi formal kurta with tilla embroidered neckline and straight trousers", "stitched"),
}


def prompts(desc: str, kind: str) -> list[str]:
    if kind == "unstitched":
        return [
            f"{MODEL}, wearing a stitched Pakistani {desc}, full outfit, {STYLE}",
            f"flat lay of neatly folded unstitched fabric pieces: {desc}, top down view, {STYLE}",
            f"extreme close-up of fabric texture and print detail of {desc}, {STYLE}",
        ]
    return [
        f"{MODEL}, wearing Pakistani {desc}, full length front view, {STYLE}",
        f"{MODEL}, wearing Pakistani {desc}, three quarter side view, {STYLE}",
        f"close-up of the embroidery and fabric detail on {desc}, {STYLE}",
    ]


HF_SPACE = "https://black-forest-labs-flux-1-schnell.hf.space"


def fetch_hf(prompt: str, seed: int) -> Image.Image:
    """Gradio API: POST /call/infer → event id → SSE stream → file URL."""
    body = json.dumps({"data": [prompt, seed, False, W, H, 4]}).encode()
    req = urllib.request.Request(f"{HF_SPACE}/gradio_api/call/infer", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        event_id = json.load(r)["event_id"]
    with urllib.request.urlopen(f"{HF_SPACE}/gradio_api/call/infer/{event_id}", timeout=300) as r:
        stream = r.read().decode()
    event = data = None
    for line in stream.splitlines():
        if line.startswith("event:"):
            event = line[6:].strip()
        elif line.startswith("data:"):
            data = line[5:].strip()
    if event != "complete" or not data:
        raise RuntimeError(f"Space returned {event}: {data}")
    url = json.loads(data)[0]["url"]
    with urllib.request.urlopen(url, timeout=120) as r:
        return Image.open(io.BytesIO(r.read())).convert("RGB")


def fetch(prompt: str, seed: int) -> Image.Image:
    if not os.environ.get("POLLINATIONS_TOKEN"):
        for attempt in range(3):
            try:
                return fetch_hf(prompt, seed)
            except Exception as e:  # noqa: BLE001
                print(f"   retry {attempt + 1}: {e}")
                time.sleep(10 * (attempt + 1))
        raise RuntimeError("giving up (Hugging Face quota may be used up — rerun later; existing images are kept)")
    return fetch_pollinations(prompt, seed)


def fetch_pollinations(prompt: str, seed: int) -> Image.Image:
    url = "https://image.pollinations.ai/prompt/" + urllib.parse.quote(prompt) + f"?width={W}&height={H}&seed={seed}&nologo=true&model=flux"
    for attempt in range(4):
        try:
            req = urllib.request.Request(url)
            token = os.environ.get("POLLINATIONS_TOKEN")
            if token:
                req.add_header("Authorization", f"Bearer {token}")
            with urllib.request.urlopen(req, timeout=180) as r:
                return Image.open(io.BytesIO(r.read())).convert("RGB")
        except Exception as e:  # noqa: BLE001 — retry on any network/service error
            print(f"   retry {attempt + 1}: {e}")
            time.sleep(5 * (attempt + 1))
    raise RuntimeError("giving up")


def finish(img: Image.Image) -> Image.Image:
    """Centre-crop to 3:4 and resize (Pollinations: crop its watermark band first)."""
    w, h = img.size
    if os.environ.get("POLLINATIONS_TOKEN"):
        img = img.crop((0, 0, w, int(h * 0.93)))
    w, h = img.size
    tw = int(h * 3 / 4)
    if tw <= w:
        left = (w - tw) // 2
        img = img.crop((left, 0, left + tw, h))
    else:
        th = int(w * 4 / 3)
        img = img.crop((0, 0, w, th))
    return img.resize((720, 960), Image.LANCZOS)


def main():
    force = "--force" in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    OUT.mkdir(parents=True, exist_ok=True)
    for i, (slug, (desc, kind)) in enumerate(PRODUCTS.items()):
        if only and slug not in only:
            continue
        for n, prompt in enumerate(prompts(desc, kind), start=1):
            path = OUT / f"{slug}-{n}.jpg"
            if path.exists() and not force:
                continue
            print(f"{slug}-{n}", flush=True)
            try:
                finish(fetch(prompt, seed=1000 + i * 10 + n)).save(path, "JPEG", quality=84, optimize=True, progressive=True)
            except RuntimeError as e:
                print(f"stopped: {e}")
                return
            time.sleep(2)  # be polite to a free service
    print("done")


if __name__ == "__main__":
    main()
