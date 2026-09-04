import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.on('console', lambda msg: print('CONSOLE:', msg.text))
    page.on('response', lambda res: print('RES:', res.status, res.url) if '/api/' in res.url else None)
    
    page.goto("http://localhost:3000/#/product/talbina-vanilla", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    page.locator("button:has-text('Buy Now')").first.click()
    time.sleep(2)
    print("Reached Checkout URL:", page.url)

    page.locator("input[placeholder*='Syed']").fill("Zaid Qureshi")
    page.locator("input[placeholder*='mobile']").fill("9876543210")
    page.locator("textarea").fill("Flat 301, Madina Residency, Bandra West")
    page.locator("input[placeholder*='Hyderabad']").fill("Mumbai")
    page.locator("input[placeholder*='Telangana']").fill("Maharashtra")
    page.locator("input[placeholder*='Pincode']").fill("400050")

    time.sleep(1)
    page.locator("button:has-text('Place Order')").click()
    time.sleep(3)

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/after_place_order.png", full_page=True)
    print("Saved after_place_order.png")

    browser.close()
