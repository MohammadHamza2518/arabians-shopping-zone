from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    
    # Assert section is completely gone
    assert page.locator("text=The Complete Sunnah Jummah Wardrobe Kit").count() == 0
    assert page.locator("text=Jummah Sunnah Mubarak Set").count() == 0
    print("PASS: Jummah bundle section is completely removed!")

    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/home_after_removal_desktop.png", full_page=True)
    print("Saved home_after_removal_desktop.png")

    mob_page = browser.new_page(viewport={"width": 390, "height": 844})
    mob_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/home_after_removal_mobile.png", full_page=True)
    print("Saved home_after_removal_mobile.png")

    browser.close()
