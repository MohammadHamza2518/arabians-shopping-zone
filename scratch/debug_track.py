import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.on('response', lambda res: print('TRACK RES JSON:', res.json()) if 'track' in res.url else None)
    page.goto('http://localhost:3000/#/track', timeout=20000, wait_until='domcontentloaded')
    page.wait_for_timeout(1000)
    page.fill("input[placeholder*='Order ID']", '1089')
    page.click("button:has-text('Track Parcel')")
    page.wait_for_timeout(2000)
    print("Has Order Ref text?", page.locator("text=Order Ref:").count())
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/debug_screen.png")
    browser.close()
