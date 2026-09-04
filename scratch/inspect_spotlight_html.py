from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto('http://localhost:3000/#/')
    page.wait_for_timeout(2000)

    html1 = page.locator('#talbina-spotlight .lg\\:col-span-5').inner_html()
    print('HTML 1 (Vanilla):')
    print(html1[:300])

    # Click Royal Milk Mawa
    btn = page.locator("#talbina-spotlight button").filter(has_text="Royal Milk Mawa")
    btn.click()
    page.wait_for_timeout(1000)

    html2 = page.locator('#talbina-spotlight .lg\\:col-span-5').inner_html()
    print('\nHTML 2 (Milk Mawa):')
    print(html2[:300])

    b.close()
