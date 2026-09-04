import os, glob

matches = []
for f in glob.glob("src/**/*.jsx", recursive=True):
    with open(f, encoding="utf-8") as fp:
        lines = fp.readlines()
        for idx, l in enumerate(lines):
            if "badge" in l.lower() or "discountpercent" in l.lower():
                matches.append(f"{f}:{idx+1}: {l.strip()}")

with open("scratch/badge_matches.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(matches))

print(f"Found {len(matches)} matches. Saved to scratch/badge_matches.txt")
