import os, time
from playwright.sync_api import sync_playwright

brain_dir = r"C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    
    # 1. Desktop Step 1
    page = browser.new_page(viewport={'width': 1280, 'height': 850})
    page.goto('http://localhost:5000/#/hamper', wait_until='networkidle')
    time.sleep(1)
    page.screenshot(path=os.path.join(brain_dir, 'v17_wizard_desktop_step1.png'))
    print('Captured v17_wizard_desktop_step1.png')

    # 2. Click Next to Step 2
    btn_step2 = page.locator("button:has-text('Next: Choose Fragrance')").first
    btn_step2.click()
    time.sleep(0.6)
    page.screenshot(path=os.path.join(brain_dir, 'v17_wizard_desktop_step2.png'))
    print('Captured v17_wizard_desktop_step2.png')

    # 3. Mobile View of Step 1
    mob_page = browser.new_page(viewport={'width': 393, 'height': 852}, is_mobile=True, has_touch=True)
    mob_page.goto('http://localhost:5000/#/hamper', wait_until='networkidle')
    time.sleep(1)
    mob_page.screenshot(path=os.path.join(brain_dir, 'v17_wizard_mobile_step1.png'))
    print('Captured v17_wizard_mobile_step1.png')

    browser.close()
    print('All wizard screenshots taken successfully!')
