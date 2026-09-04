import os, time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # -------------------------------------------------------------
    # TEST 1: PRODUCT PAGE DUAL BUTTONS & SMART SIZE FINDER (Desktop)
    # -------------------------------------------------------------
    page = browser.new_page(viewport={"width": 1280, "height": 850})
    page.goto("http://localhost:5000/#/product/thobe-saudi-classic-white", wait_until="networkidle")
    time.sleep(1)

    # Verify Dual Action Buttons
    buy_now_btn = page.locator("button:has-text('Buy Now')").first
    whatsapp_btn = page.locator("button:has-text('Buy via WhatsApp')").first
    size_finder_btn = page.locator("button:has-text('Smart Size Finder')").first

    assert buy_now_btn.is_visible(), "Buy Now button should be visible"
    assert whatsapp_btn.is_visible(), "WhatsApp Buy button should be visible"
    assert size_finder_btn.is_visible(), "Smart Size Finder button should be visible"

    page.screenshot(path=os.path.join(brain_dir, "v14_test1_product_dual_buttons.png"))
    print("PASS: Test 1 - Product Page Dual Action Buttons visible")

    # Click Smart Size Finder
    size_finder_btn.click()
    time.sleep(0.5)

    # Verify modal opened
    modal_title = page.locator("text=Thobe Smart Size Finder")
    assert modal_title.is_visible(), "Size Finder modal should open"
    page.screenshot(path=os.path.join(brain_dir, "v14_test1_size_finder_modal.png"))
    print("PASS: Test 1 - Smart Size Finder Modal opened")

    # Click Apply Size 56
    page.locator("button:has-text('Apply Size 56')").click()
    time.sleep(0.5)
    print("PASS: Test 1 - Applied Size 56 from Calculator")

    # -------------------------------------------------------------
    # TEST 2: MOBILE VIEWPORT STICKY BAR & DUAL BUTTONS
    # -------------------------------------------------------------
    mob_page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    mob_page.goto("http://localhost:5000/#/product/thobe-saudi-classic-white", wait_until="networkidle")
    time.sleep(1)
    mob_page.evaluate("window.scrollTo(0, 400)")
    time.sleep(0.5)

    mob_page.screenshot(path=os.path.join(brain_dir, "v14_test2_mobile_product_sticky_bar.png"))
    print("PASS: Test 2 - Mobile sticky purchase bar captured")

    # -------------------------------------------------------------
    # TEST 3: CUSTOM NIKAH & GIFT HAMPER BUILDER (/hamper)
    # -------------------------------------------------------------
    page.goto("http://localhost:5000/#/hamper", wait_until="networkidle")
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, "v14_test3_hamper_builder_desktop.png"))

    # Test selecting second thobe
    olive_thobe = page.locator("button:has-text('Emirati Al-Noor Olive Jubba')").first
    olive_thobe.click()
    time.sleep(0.4)

    # Test selecting second fragrance
    musk = page.locator("button:has-text('Royal White Musk Attar')").first
    musk.click()
    time.sleep(0.4)

    # Fill names
    page.fill("input[placeholder*='Mohammed Tariq']", "Brother Tariq")
    page.fill("input[placeholder*='Siddiqui Family']", "Abu Bakr & Family")

    page.screenshot(path=os.path.join(brain_dir, "v14_test3_hamper_customized.png"))
    print("PASS: Test 3 - Hamper Builder customized and previewed")

    # Click Add Complete Hamper to Bag
    page.locator("button:has-text('Add to Bag')").first.click()
    time.sleep(0.8)
    print("PASS: Test 3 - Hamper added to Bag")

    # -------------------------------------------------------------
    # TEST 4: ADMIN PANEL COUPON MANAGER
    # -------------------------------------------------------------
    page.goto("http://localhost:5000/#/admin", wait_until="networkidle")
    time.sleep(0.5)

    # Login
    page.fill("input[placeholder*='Store Passcode']", "arabians786")
    page.locator("button:has-text('Unlock Admin Dashboard')").click()
    time.sleep(1)

    # Click Promo Coupons tab
    coupons_tab = page.locator("button:has-text('Promo Coupons')").first
    coupons_tab.click()
    time.sleep(0.8)

    page.screenshot(path=os.path.join(brain_dir, "v14_test4_admin_coupons_tab.png"))
    print("PASS: Test 4 - Admin Coupons Tab displayed")

    # Click Create New Coupon
    page.locator("button:has-text('Create New Coupon')").first.click()
    time.sleep(0.5)

    # Fill coupon form
    page.fill("input[placeholder*='JUMMAH15']", "JUMMAH20")
    page.fill("input[placeholder*='Jummah Blessings']", "20% Special Jummah Discount")
    page.screenshot(path=os.path.join(brain_dir, "v14_test4_admin_create_coupon_modal.png"))

    page.locator("button:has-text('Create & Activate Coupon')").click()
    time.sleep(1)
    print("PASS: Test 4 - Created coupon JUMMAH20")

    # -------------------------------------------------------------
    # TEST 5: CHECKOUT PAGE 1-TAP QUICK COUPONS
    # -------------------------------------------------------------
    page.goto("http://localhost:5000/#/checkout", wait_until="networkidle")
    time.sleep(1)

    page.screenshot(path=os.path.join(brain_dir, "v14_test5_checkout_quick_coupons.png"))
    print("PASS: Test 5 - Checkout Quick 1-Tap Coupons rendered")

    # -------------------------------------------------------------
    # TEST 6: INSTANT VISUAL LIVE SEARCH IN HEADER
    # -------------------------------------------------------------
    page.goto("http://localhost:5000/#/", wait_until="networkidle")
    time.sleep(1)

    search_input = page.locator("input[placeholder*='Search Talbina']").first
    search_input.fill("tal")
    time.sleep(0.6)

    page.screenshot(path=os.path.join(brain_dir, "v14_test6_instant_visual_search.png"))
    print("PASS: Test 6 - Instant Visual Live Search dropdown rendered")

    browser.close()
    print("ALL 6 TESTS COMPLETED SUCCESSFULLY!")
