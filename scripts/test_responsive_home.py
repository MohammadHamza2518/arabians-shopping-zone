import os, time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. DESKTOP VIEWPORT (1280x850)
    desk_page = browser.new_page(viewport={"width": 1280, "height": 850})
    desk_page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)
    desk_page.screenshot(path=os.path.join(brain_dir, "v18_desktop_home_perfect.png"))
    print("Saved v18_desktop_home_perfect.png")

    # 2. MOBILE VIEWPORT (393x852)
    mob_page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    mob_page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)
    mob_page.screenshot(path=os.path.join(brain_dir, "v18_mobile_home_perfect.png"))
    print("Saved v18_mobile_home_perfect.png")

    browser.close()
    print("Both Desktop & Mobile captures completed!")
