from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    
    # 1. Homepage public view
    page.goto("http://localhost:5000/#/", wait_until="networkidle")
    admin_links = page.locator('a[href*="admin"]').count()
    print("Public admin links on homepage:", admin_links)

    # 2. Secret URL access directly
    page.goto("http://localhost:5000/#/admin", wait_until="networkidle")
    has_passcode_input = page.locator("input[type='password']").is_visible()
    print("Direct URL /#/admin passcode prompt visible:", has_passcode_input)

    browser.close()
