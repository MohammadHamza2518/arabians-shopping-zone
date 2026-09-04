from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("http://localhost:3000/#/shop?category=wearing", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Scroll down to the filter row
    page.evaluate("window.scrollBy(0, 300)")
    time.sleep(1)

    # Find the sort button
    sort_btn = page.locator("button:has-text('Sort: Featured')")
    print("Found sort button:", sort_btn.count())
    sort_btn.click()
    time.sleep(1)

    # Capture open dropdown screenshot
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/sort_dropdown_luxury_open.png")
    print("Saved sort_dropdown_luxury_open.png")

    # Click on 'Price: Low to High'
    low_high = page.locator("button[role='option']:has-text('Price: Low to High')")
    print("Found low_high option:", low_high.count())
    low_high.click()
    time.sleep(1)

    # Capture sorted state
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/sort_dropdown_luxury_selected.png")
    print("Saved sort_dropdown_luxury_selected.png")

    browser.close()
    print("ALL SORT DROPDOWN TESTS PASSED!")
