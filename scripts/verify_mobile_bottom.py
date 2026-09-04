import os
import time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    # Mobile viewport matching user's phone
    page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)

    # Scroll all the way to the very bottom
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(1)

    # Capture bottom view
    page.screenshot(path=os.path.join(brain_dir, "v3_mobile_footer_bottom.png"))
    print("Saved v3_mobile_footer_bottom.png")

    browser.close()
    print("Mobile bottom scroll test complete!")
