import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844}) # mobile
    page.goto("http://localhost:3000/#/shop", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Add item to cart
    add_btn = page.locator("button:has-text('Add to Cart')").first
    add_btn.click()
    time.sleep(1)

    # Go to checkout
    page.goto("http://localhost:3000/#/checkout", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1)

    # Fill checkout form
    page.fill("input[placeholder*='Full Name'], input[name='name']", "Zaid Qureshi")
    page.fill("input[placeholder*='Phone'], input[name='phone']", "9876543210")
    page.fill("textarea[placeholder*='House'], textarea[name='address'], input[placeholder*='Address']", "Flat 301, Madina Residency")
    page.fill("input[placeholder*='City'], input[name='city']", "Mumbai")
    page.fill("input[placeholder*='PIN'], input[name='pincode']", "400001")

    # Click place order
    page.click("button:has-text('Place Order')")
    time.sleep(2)

    # Verify WhatsApp Order slip button exists
    assert page.locator("text=Instant WhatsApp Order Slip").count() > 0
    assert page.locator("text=Send Order Confirmation to WhatsApp").count() > 0
    print("PASS: WhatsApp Order Slip verified on confirmation screen!")

    # Screenshot
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/checkout_whatsapp_success_mobile.png", full_page=True)
    print("Saved checkout_whatsapp_success_mobile.png")

    browser.close()
