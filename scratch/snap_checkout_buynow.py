import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    
    page.goto("http://localhost:3000/#/product/talbina-vanilla", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Click Buy Now
    page.click("button:has-text('Buy Now')")
    time.sleep(2)
    print("Reached Checkout URL:", page.url)

    # Fill checkout form fields
    page.locator("input").nth(0).fill("Zaid Qureshi")
    page.locator("input[type='tel'], input[placeholder*='Phone']").fill("9876543210")
    
    # Address textarea
    addr_el = page.locator("textarea")
    if addr_el.count() > 0:
        addr_el.fill("Flat 301, Madina Residency, Bandra West")
    
    page.locator("input[placeholder*='City']").fill("Mumbai")
    page.locator("input[placeholder*='PIN'], input[placeholder*='Pin']").fill("400050")

    time.sleep(1)
    # Click Place Order
    page.click("button:has-text('Place Order')")
    time.sleep(3)

    print("Success text found count:", page.locator("text=Order Reference ID").count())
    print("WhatsApp Order Slip count:", page.locator("text=Instant WhatsApp Order Slip").count())

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/order_whatsapp_confirmation_mobile.png", full_page=True)
    print("Saved order_whatsapp_confirmation_mobile.png successfully!")

    browser.close()
