import json, os
from PIL import Image

with open("server/data/store.json", encoding="utf-8") as f:
    store = json.load(f)

print(f"Total products: {len(store['products'])}")
for p in store['products']:
    img_path = p["image"].lstrip("/")
    full_path = os.path.join(os.getcwd(), "public", img_path)
    if not os.path.exists(full_path):
        full_path = os.path.join(os.getcwd(), img_path)
    
    size = "N/A"
    ratio = 1.0
    if os.path.exists(full_path):
        try:
            with Image.open(full_path) as im:
                size = im.size
                ratio = round(im.size[1] / im.size[0], 2)
        except Exception as e:
            pass
    print(f"[{p['category']}] {p['id']}: size={size}, H/W={ratio}")
