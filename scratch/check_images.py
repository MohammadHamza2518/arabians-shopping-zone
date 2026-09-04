import json
from PIL import Image
import os

with open("server/data/store.json", encoding="utf-8") as f:
    store = json.load(f)

for p in store["products"]:
    if p["category"] == "wearing":
        img_path = p["image"].lstrip("/")
        full_path = os.path.join(os.getcwd(), "public", img_path)
        if not os.path.exists(full_path):
            full_path = os.path.join(os.getcwd(), img_path)
        
        exists = os.path.exists(full_path)
        size = "N/A"
        if exists:
            try:
                with Image.open(full_path) as im:
                    size = im.size
            except Exception as e:
                size = str(e)
        print(f"ID: {p['id']}, Name: {p['name']}, Img: {p['image']}, Exists: {exists}, Size: {size}")
