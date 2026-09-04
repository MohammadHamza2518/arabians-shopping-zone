from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 1. Mobile Initial Track View
    mob_page = browser.new_page(viewport={"width": 390, "height": 844})
    mob_page.goto("http://localhost:3000/#/track", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/track_initial_mobile.png", full_page=True)
    print("Saved track_initial_mobile.png")

    # 2. Desktop Initial Track View
    desk_page = browser.new_page(viewport={"width": 1280, "height": 900})
    desk_page.goto("http://localhost:3000/#/track", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    desk_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/track_initial_desktop.png")
    print("Saved track_initial_desktop.png")

    # 3. Test Demo Tracking Click on Mobile
    mob_page.locator("button:has-text('ASZ-1089')").click()
    time.sleep(2)
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/track_result_mobile.png", full_page=True)
    print("Saved track_result_mobile.png")

    # Assert tracking details visible
    assert mob_page.locator("text=Current Shipment Status:").count() > 0
    assert mob_page.locator("text=Real-Time Shipment Milestones").count() > 0
    print("PASS: Tracking details loaded successfully!")

    browser.close()
