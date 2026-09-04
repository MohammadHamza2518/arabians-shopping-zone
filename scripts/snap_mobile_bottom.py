import os, time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)
    
    # Scroll to Load More button
    btn = page.locator("button:has-text('Load More')").first
    btn.scroll_into_view_if_needed()
    time.sleep(0.5)
    page.screenshot(path=os.path.join(brain_dir, "v20_mobile_load_more_controller.png"))
    print("Saved v20_mobile_load_more_controller.png")
    browser.close()
