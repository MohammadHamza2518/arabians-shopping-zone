import os, time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # 1. DESKTOP VIEWPORT (1280x850)
    page = browser.new_page(viewport={"width": 1280, "height": 850})
    page.goto("http://localhost:5000/#/hamper", wait_until="networkidle")
    time.sleep(1)

    # Verify Occasion presets exist
    groom_preset = page.locator("button:has-text('Royal Groom Nikah')").first
    eid_preset = page.locator("button:has-text('Eid Family Blessing')").first
    shifa_preset = page.locator("button:has-text('Prophetic Shifa & Health')").first

    assert groom_preset.is_visible(), "Groom preset should be visible"
    assert eid_preset.is_visible(), "Eid preset should be visible"
    assert shifa_preset.is_visible(), "Shifa preset should be visible"

    page.screenshot(path=os.path.join(brain_dir, "v19_hamper2_desktop_groom.png"))
    print("Saved v19_hamper2_desktop_groom.png")

    # Test clicking Eid preset
    eid_preset.click()
    time.sleep(0.6)
    page.screenshot(path=os.path.join(brain_dir, "v19_hamper2_desktop_eid.png"))
    print("Saved v19_hamper2_desktop_eid.png")

    # Go to Step 4 (Trunk & Card)
    step4_btn = page.locator("button:has-text('4. Trunk & Card')").first
    step4_btn.click()
    time.sleep(0.6)
    page.screenshot(path=os.path.join(brain_dir, "v19_hamper2_step4_options.png"))
    print("Saved v19_hamper2_step4_options.png")

    # 2. MOBILE VIEWPORT (393x852)
    mob_page = browser.new_page(viewport={"width": 393, "height": 852}, is_mobile=True, has_touch=True)
    mob_page.goto("http://localhost:5000/#/hamper", wait_until="networkidle")
    time.sleep(1)
    mob_page.screenshot(path=os.path.join(brain_dir, "v19_hamper2_mobile_view.png"))
    print("Saved v19_hamper2_mobile_view.png")

    browser.close()
    print("All Hamper 2.0 tests completed successfully!")
