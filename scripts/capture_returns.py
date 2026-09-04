import os
import time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 850})
    page.goto("http://localhost:5000", wait_until="networkidle")
    
    # Click Contact Support in footer bottom bar
    page.locator("button:has-text('Contact Support')").first.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "policy_contact.png"))
    print("Saved policy_contact.png")

    # Click Return & Refunds tab inside modal
    page.locator("button:has-text('Return & Refunds')").first.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "policy_returns.png"))
    print("Saved policy_returns.png")

    browser.close()
    print("Screenshots captured cleanly!")
