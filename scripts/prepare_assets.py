import os
import shutil
from PIL import Image

dest_dir = "public/assets"
os.makedirs(f"{dest_dir}/logo", exist_ok=True)
os.makedirs(f"{dest_dir}/talbina", exist_ok=True)
os.makedirs(f"{dest_dir}/thobes", exist_ok=True)
os.makedirs(f"{dest_dir}/categories", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

# 1. Copy Logos
logo_src = r"arabians all images\all type logos"
logos = sorted(os.listdir(logo_src))
for i, f in enumerate(logos):
    if f.endswith('.png') or f.endswith('.jpg'):
        shutil.copy2(os.path.join(logo_src, f), f"{dest_dir}/logo/logo_{i+1}.png")
        if i == 0:
            shutil.copy2(os.path.join(logo_src, f), f"{dest_dir}/logo/logo_main.png")
print("Logos copied.")

# 2. Copy Talbina images with clean semantic names
talbina_map = {
    "01_22_50": "talbina_vanilla_dryfruits.png",
    "01_23_07": "talbina_milk_mawa.png",
    "01_23_17": "talbina_baby_barley.png",
    "01_23_29": "talbina_chocolate_kids.png",
    "01_23_42": "talbina_dry_dates_vanilla.png",
}

talbina_src = r"arabians all images\talbina food"
for f in os.listdir(talbina_src):
    for key, val in talbina_map.items():
        if key in f:
            shutil.copy2(os.path.join(talbina_src, f), f"{dest_dir}/talbina/{val}")
            print(f"Copied Talbina: {val}")

# 3. Copy Thobes from extracted
thobes_src = "assets_extracted/thobes"
if os.path.exists(thobes_src):
    for f in os.listdir(thobes_src):
        if f.endswith('.png') or f.endswith('.jpg'):
            shutil.copy2(os.path.join(thobes_src, f), f"{dest_dir}/thobes/{f}")
    print(f"Copied {len(os.listdir(thobes_src))} Thobe images.")

print("All client assets successfully organized in public/assets!")
