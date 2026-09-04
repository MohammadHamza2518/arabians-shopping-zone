import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    
    # Go to product detail
    page.goto("http://localhost:3000/#/product/thobe-saudi-classic-white", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    
    # Click Instant Order / Buy Now
    buy_btn = page.locator("button:has-text('Instant Order'), button:has-text('Buy Now')").first
    if buy_btn.count() > 0:
        buy_btn.click()
    else:
        page.locator("button:has-text('Add to Cart')").first.click()
        time.sleep(1)
        page.goto("http://localhost:3000/#/checkout")
    
    time.sleep(2)
    print("On checkout URL:", page.url)
    
    # Fill form
    page.fill("input[placeholder*='Full Name'], input[name='name']", "Zaid Qureshi")
    page.fill("input[placeholder*='Phone'], input[name='phone']", "9876543210")
    page.fill("textarea, input[placeholder*='House'], input[placeholder*='Address']", "Flat 301, Madina Residency, Bandra West")
    page.fill("input[placeholder*='City'], input[name='city']", "Mumbai")
    page.fill("input[placeholder*='PIN'], input[name='pincode']", "400050")
    
    time.sleep(1)
    # Click Place Order
    page.click("button:has-text('Place Order')")
    time.sleep(3)
    
    # Verify WhatsApp Order slip button exists
    wa_slip_count = page.locator("text=Instant WhatsApp Order Slip").count()
    print("WhatsApp Order Slip count:", wa_slip_count)
    
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/checkout_whatsapp_success_verified.png", full_page=True)
    print("Saved checkout_whatsapp_success_verified.png successfully!")
    
    browser.close()
