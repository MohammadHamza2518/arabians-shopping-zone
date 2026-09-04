import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:3000/#/product/talbina-vanilla", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    
    # Click Instant Order
    page.click("button:has-text('Instant Order')")
    time.sleep(2)
    print("Checkout URL:", page.url)

    # Fill checkout form
    page.fill("input[name='fullName'], input[placeholder*='Full Name']", "Zaid Qureshi")
    page.fill("input[name='phone'], input[placeholder*='Phone']", "9876543210")
    page.fill("textarea, input[placeholder*='Address'], input[placeholder*='House']", "Flat 301, Madina Residency, Bandra West")
    page.fill("input[name='city'], input[placeholder*='City']", "Mumbai")
    page.fill("input[name='pincode'], input[placeholder*='PIN']", "400050")
    time.sleep(1)

    # Click Place Order
    page.click("button:has-text('Place Order')")
    time.sleep(3)

    wa_text = page.locator("text=Instant WhatsApp Order Slip")
    print("WhatsApp Order Slip found:", wa_text.count())

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/checkout_whatsapp_verified_final.png", full_page=True)
    print("Saved checkout_whatsapp_verified_final.png")

    browser.close()
