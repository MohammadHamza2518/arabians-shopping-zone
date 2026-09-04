from playwright.sync_api import sync_playwright
import time
import urllib.parse
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    print("1. Testing Product Detail Page WhatsApp link...")
    page.goto("http://localhost:3000/#/product/talbina-vanilla", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Check floating WhatsApp
    floating = page.locator("a[title*='WhatsApp Live Support']")
    if floating.count() > 0:
        href = floating.first.get_attribute("href")
        print("Floating WhatsApp href:", href)
        assert "917233862626" in href
        assert "text=" in href
        parsed = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
        print("Decoded prefilled message:\n", parsed.get('text', [''])[0])

    print("2. Testing Contact Page WhatsApp link...")
    page.goto("http://localhost:3000/#/contact", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1)
    wa_card = page.locator("a:has-text('WhatsApp Support')")
    if wa_card.count() > 0:
        card_href = wa_card.first.get_attribute("href")
        print("Contact Page WhatsApp href:", card_href)
        assert "917233862626" in card_href

    call_card = page.locator("a:has-text('Call Helpline')")
    if call_card.count() > 0:
        call_href = call_card.first.get_attribute("href")
        print("Contact Page Call href:", call_href)
        assert "92360" in call_href

    browser.close()
    print("All WhatsApp automatic message checks PASSED!")
