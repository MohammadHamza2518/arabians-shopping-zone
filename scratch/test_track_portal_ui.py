from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3000/#/track", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # 1. Test search by numeric only
    page.fill("input[type='text']", "1089")
    page.click("button:has-text('Track Parcel')")
    time.sleep(2)

    # Check official carrier portal link
    assert page.locator("text=Track on Official BlueDart Express Portal").count() > 0 or page.locator("text=Track on Official").count() > 0
    print("PASS: Official courier portal button verified!")

    # Check AWB copy button
    copy_btn = page.locator("button[title='Copy AWB Tracking Number']")
    assert copy_btn.count() > 0
    copy_btn.click()
    time.sleep(1)
    print("PASS: AWB copy button clicked and verified!")

    # Screenshot of active tracking result
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/track_official_portal_active.png")
    print("Saved track_official_portal_active.png")

    browser.close()
