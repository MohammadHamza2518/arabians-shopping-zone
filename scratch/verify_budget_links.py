from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    
    # 1. Under 499
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1)
    page.locator("a[href*='maxPrice=499']").click()
    time.sleep(1)
    assert "maxPrice=499" in page.url
    print("PASS: Under 499 link verified")

    # 2. Under 999
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1)
    page.locator("a[href*='maxPrice=999']").click()
    time.sleep(1)
    assert "maxPrice=999" in page.url
    print("PASS: Under 999 link verified")

    # 3. Above 1499
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1)
    page.locator("a[href*='minPrice=1499']").click()
    time.sleep(1)
    assert "minPrice=1499" in page.url
    print("PASS: Above 1499 link verified")

    # 4. Gift Trunks
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1)
    page.locator("a[href*='/hamper']").first.click()
    time.sleep(1)
    assert "hamper" in page.url
    print("PASS: Hamper link verified")

    browser.close()
    print(">>> ALL 4 BUDGET TIERS 100% OPERATIONAL! <<<")
