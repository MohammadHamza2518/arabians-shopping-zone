import sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3000/#/track", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Search for numeric 1089
    page.fill("input[type='text']", "1089")
    page.click("button:has-text('Track Parcel')")
    time.sleep(2)

    # Check that the order card is rendered
    status_header = page.locator("text=DISPATCHED")
    print("Found status DISPATCHED count:", status_header.count())
    assert status_header.count() > 0

    order_ref = page.locator("text=Order Ref: ASZ-1089")
    print("Found Order Ref count:", order_ref.count())
    assert order_ref.count() > 0

    portal_link = page.locator("a:has-text('Track on Official')")
    print("Official carrier portal link count:", portal_link.count())
    if portal_link.count() > 0:
        print("Link text:", portal_link.first.text_content())
        print("Link href:", portal_link.first.get_attribute("href"))

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/verified_track_portal_desktop.png")
    print("Saved verified_track_portal_desktop.png successfully!")

    browser.close()
