from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.set_content('<img src="http://localhost:3000/assets/talbina/talbina_milk_mawa.png" id="test">')
    page.wait_for_timeout(2000)
    res = page.evaluate("""() => {
        const el = document.getElementById('test');
        return { complete: el.complete, naturalWidth: el.naturalWidth };
    }""")
    print('Test result:', res)
    b.close()
