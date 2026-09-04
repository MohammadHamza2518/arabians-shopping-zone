import os, time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. Desktop Test
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)

    # Scroll to Reels Showcase
    page.locator("#reels-section").scroll_into_view_if_needed()
    time.sleep(0.5)
    page.screenshot(path=os.path.join(brain_dir, "v21_reels_desktop_position.png"))
    print("Saved v21_reels_desktop_position.png")

    # 2. Mobile View Test
    mob_page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    mob_page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)
    mob_page.locator("#reels-section").scroll_into_view_if_needed()
    time.sleep(0.5)
    mob_page.screenshot(path=os.path.join(brain_dir, "v21_reels_mobile_position.png"))
    print("Saved v21_reels_mobile_position.png")

    browser.close()
    print("Reels position tests completed successfully!")
