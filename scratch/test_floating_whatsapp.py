from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    print("1. Checking Home Page...")
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    wa_home = page.locator("aside[aria-label='WhatsApp Support'] a")
    print("WhatsApp on Home count:", wa_home.count())
    assert wa_home.count() == 1, "WhatsApp should be present on Home page!"

    # Take screenshot of bottom right on Home page
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/home_page_floating_whatsapp.png")
    print("Saved home_page_floating_whatsapp.png")

    print("2. Checking Contact Page...")
    page.goto("http://localhost:3000/#/contact", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1)
    wa_contact = page.locator("aside[aria-label='WhatsApp Support'] a")
    print("WhatsApp on Contact count:", wa_contact.count())
    assert wa_contact.count() == 0, "WhatsApp should NOT be present on Contact page!"

    print("3. Checking Shop Page...")
    page.goto("http://localhost:3000/#/shop", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1)
    wa_shop = page.locator("aside[aria-label='WhatsApp Support'] a")
    print("WhatsApp on Shop count:", wa_shop.count())
    assert wa_shop.count() == 0, "WhatsApp should NOT be present on Shop page!"

    print("4. Checking Checkout Page...")
    page.goto("http://localhost:3000/#/checkout", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1)
    wa_checkout = page.locator("aside[aria-label='WhatsApp Support'] a")
    print("WhatsApp on Checkout count:", wa_checkout.count())
    assert wa_checkout.count() == 0, "WhatsApp should NOT be present on Checkout page!"

    browser.close()
    print("ALL FLOATING WHATSAPP TESTS PASSED PERFECTLY!")
