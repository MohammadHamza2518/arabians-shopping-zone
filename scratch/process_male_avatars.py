import os
from PIL import Image

dest_dir = r"c:\Users\moham\Downloads\arabians shopping zone\public\assets\avatars"
os.makedirs(dest_dir, exist_ok=True)

raw_imgs = [
    # Image 1: (576, 1024) - cap and dark shirt
    (r"C:\Users\moham\.gemini\antigravity\brain\26f9459c-d96e-45f1-9b55-3425b9aedb3e\.user_uploaded\media_1788518582689.jpg", 0.20, "male_avatar_1.jpg"),
    # Image 2: (576, 1024) - white knitted cap and grey shirt
    (r"C:\Users\moham\.gemini\antigravity\brain\26f9459c-d96e-45f1-9b55-3425b9aedb3e\.user_uploaded\media_1788518582943.jpg", 0.10, "male_avatar_2.jpg"),
    # Image 3: (736, 979) - glasses, stylish beard, white kurta in park
    (r"C:\Users\moham\.gemini\antigravity\brain\26f9459c-d96e-45f1-9b55-3425b9aedb3e\.user_uploaded\media_1788518582949.jpg", 0.05, "male_avatar_3.jpg"),
    # Image 4: (544, 1024) - white cap, white kurta, smile
    (r"C:\Users\moham\.gemini\antigravity\brain\26f9459c-d96e-45f1-9b55-3425b9aedb3e\.user_uploaded\media_1788518582962.jpg", 0.05, "male_avatar_4.jpg")
]

for src_path, y_offset_pct, fname in raw_imgs:
    im = Image.open(src_path)
    w, h = im.size
    # crop square
    crop_size = min(w, h)
    y_start = int(h * y_offset_pct)
    if y_start + crop_size > h:
        y_start = h - crop_size
    box = (0, y_start, crop_size, y_start + crop_size)
    cropped = im.crop(box)
    cropped_resized = cropped.resize((300, 300), Image.Resampling.LANCZOS)
    out_path = os.path.join(dest_dir, fname)
    cropped_resized.save(out_path, quality=92)
    print(f"Saved {fname} at {out_path} (box: {box})")

print("All male avatars processed successfully!")
