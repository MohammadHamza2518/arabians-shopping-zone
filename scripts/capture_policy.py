import os
import time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 850})
    page.goto("http://localhost:5000", wait_until="networkidle")
    
    # Scroll to footer and click Shipping Policy button
    page.locator("button:has-text('Shipping Policy')").first.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "policy_shipping.png"))
    print("Saved policy_shipping.png")

    # Click Contact Us tab
    page.locator("button:has-text('Contact Us')").first.click()
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "policy_contact.png"))
    print("Saved policy_contact.png")

    browser.close()
    print("ALL POLICY SCREENS SAVED!")
