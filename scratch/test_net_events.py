from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.on('request', lambda r: print('REQ:', r.method, r.url))
    page.on('response', lambda r: print('RES:', r.status, r.url))
    page.on('requestfailed', lambda r: print('FAIL:', r.url, r.failure))

    page.goto('http://localhost:3000/#/')
    page.wait_for_timeout(2000)

    print('--- CLICKING MILK MAWA ---')
    btn = page.locator('#talbina-spotlight button').filter(has_text='Royal Milk Mawa')
    btn.click()
    page.wait_for_timeout(3000)

    b.close()
