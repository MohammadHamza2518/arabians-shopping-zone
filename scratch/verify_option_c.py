from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    
    print("Navigating to Homepage...")
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # 1. Test Flash Sale Timer
    timer_locator = page.locator("text=Special Sunnah Blessing Deal")
    assert timer_locator.count() > 0, "Flash sale timer banner missing!"
    print("PASS: Flash sale timer banner present!")

    # Test Copy button
    copy_btn = page.locator("button:has-text('ARABIAN10')")
    assert copy_btn.count() > 0, "Coupon copy button missing!"
    copy_btn.click()
    time.sleep(0.5)
    assert page.locator("text=COPIED!").count() > 0, "Coupon not showing copied state!"
    print("PASS: Coupon 1-click copy works!")

    # 2. Test Shop By Budget (Under ₹499)
    page.evaluate("window.scrollBy(0, 700)")
    time.sleep(1)
    under_499_link = page.locator("a[href*='maxPrice=499']")
    assert under_499_link.count() > 0, "Under 499 budget link missing!"
    under_499_link.click()
    time.sleep(1.5)
    assert "maxPrice=499" in page.url, f"Expected maxPrice=499 in URL, got {page.url}"
    
    # Check all displayed products on filtered shop page are <= 499
    cards = page.locator("[data-testid='product-card']").all()
    print(f"Products under 499 count: {len(cards)}")
    for c in cards:
        price = float(c.get_attribute("data-price"))
        assert price <= 499, f"Product price {price} exceeds 499!"
    print("PASS: Under 499 filter mathematically accurate!")

    # 3. Navigate back to Home and test 1-Click Sunnah Jummah Combo
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    page.evaluate("window.scrollBy(0, 1500)")
    time.sleep(1)

    combo_btn = page.locator("button:has-text('Add Full Kit to Cart')")
    assert combo_btn.count() > 0, "1-Click Sunnah Combo button missing!"
    combo_btn.click()
    time.sleep(1)
    assert page.locator("text=ALL 3 ITEMS ADDED TO CART!").count() > 0
    print("PASS: 1-Click Sunnah Jummah Combo successfully added 3 items!")

    # 4. Capture Desktop Full Page Screenshot
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/option_c_home_desktop.png", full_page=True)
    print("Saved option_c_home_desktop.png")

    # 5. Capture Mobile Full Page Screenshot
    mob_page = browser.new_page(viewport={"width": 390, "height": 844})
    mob_page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)
    mob_page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/option_c_home_mobile.png", full_page=True)
    print("Saved option_c_home_mobile.png")

    browser.close()

print("\n>>> ALL OPTION C FEATURES VERIFIED 100% OPERATIONAL! <<<")
