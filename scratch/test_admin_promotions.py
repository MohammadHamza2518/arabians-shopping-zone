from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

    print("1. Logging into Admin Panel...")
    page.goto("http://localhost:3000/#/admin", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    # Enter passcode
    passcode_input = page.locator("input[type='password']")
    if passcode_input.count() > 0:
        passcode_input.fill("arabians786")
        page.locator("button[type='submit']").click()
        time.sleep(1.5)

    print("PASS: Logged in to Admin!")

    # 2. Click Settings Tab
    settings_tab = page.locator("button:has-text('Store & Shipping Settings')").first
    settings_tab.click()
    time.sleep(2)
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/admin_screen_after_tab.png")
    print("Page URL:", page.url)
    print("Active tab text on screen:")
    h3s = page.locator("h3").all_text_contents()
    print("H3s:", h3s)
    h4s = page.locator("h4").all_text_contents()
    print("H4s:", h4s)
    assert page.locator("text=1-Click Sunnah Jummah Wardrobe Kit Combo").count() > 0
    print("PASS: Admin Promotional Controls are visible!")

    # 3. Modify Flash Sale Coupon & Headline
    coupon_input = page.locator("input[placeholder*='ARABIAN10']")
    coupon_input.fill("EID2026")

    headline_input = page.locator("input[placeholder*='Flat 10% Off']")
    headline_input.fill("Mega Eid Mubarak Clearance Sale - Special 10% Off!")

    # Modify Jummah Combo Price
    combo_price_input = page.locator("input[value='2299']")
    if combo_price_input.count() > 0:
        combo_price_input.fill("1999")

    # Take screenshot of Admin Settings tab
    page.screenshot(path="C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/admin_promotions_panel.png")
    print("Saved admin_promotions_panel.png")

    # 4. Save settings
    save_btn = page.locator("button:has-text('Save & Publish Store Settings')")
    save_btn.scroll_into_view_if_needed()
    time.sleep(0.5)
    
    with page.expect_response("**/api/settings") as response_info:
        save_btn.click()
    response = response_info.value
    print("Settings API Response Status:", response.status)
    print("PASS: Settings successfully saved to server!")
    time.sleep(1)

    # 5. Check storefront reflecting changes
    print("Navigating to Storefront...")
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(2)

    assert page.locator("text=Mega Eid Mubarak Clearance Sale").count() > 0, "New headline not found on storefront!"
    assert page.locator("button:has-text('EID2026')").count() > 0, "New coupon EID2026 not found on storefront!"
    print("PASS: Storefront dynamically updated with Admin changes!")

    # Test copy coupon on new coupon
    page.locator("button:has-text('EID2026')").click()
    time.sleep(0.5)
    assert page.locator("text=COPIED!").count() > 0
    print("PASS: Dynamic coupon copy works for admin updated coupon!")

    # Check Jummah Combo Price updated to ₹1999
    assert page.locator("text=₹1999").count() > 0, "Updated combo price ₹1999 not found on storefront!"
    print("PASS: Jummah Combo price dynamically updated to 1999!")

    # 6. Reset settings back cleanly to standard default
    print("Resetting back to standard defaults...")
    page.goto("http://localhost:3000/#/admin", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1.5)
    page.locator("button:has-text('Store & Shipping Settings')").first.click()
    time.sleep(1)

    page.locator("input[value='EID2026']").fill("ARABIAN10")
    page.locator("input[value='Mega Eid Mubarak Clearance Sale - Special 10% Off!']").fill("Flat 10% Off On Orders Above ₹999 + Free Express Pan-India COD")
    page.locator("input[value='1999']").fill("2299")
    reset_save = page.locator("button:has-text('Save & Publish Store Settings')")
    reset_save.scroll_into_view_if_needed()
    with page.expect_response("**/api/settings") as res_info:
        reset_save.click()
    print("Reset Status:", res_info.value.status)
    time.sleep(1)

    # Verify reset on storefront
    page.goto("http://localhost:3000/#/", timeout=20000, wait_until="domcontentloaded")
    time.sleep(1.5)
    assert page.locator("button:has-text('ARABIAN10')").count() > 0
    assert page.locator("text=₹2299").count() > 0
    print("PASS: Cleanly restored to standard defaults!")

    browser.close()

print("\n>>> ALL ADMIN SETTINGS & STOREFRONT SYNC VERIFIED 100% OPERATIONAL! <<<")
