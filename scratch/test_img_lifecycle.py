from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto('http://localhost:3000/#/')
    page.wait_for_timeout(2000)

    # Check vanilla image first
    v_loaded = page.evaluate("""() => {
        const img = document.querySelector('#talbina-spotlight img');
        return { src: img.src, complete: img.complete, nw: img.naturalWidth, nh: img.naturalHeight };
    }""")
    print("Vanilla img:", v_loaded)

    # Now click Milk Mawa
    btn = page.locator('#talbina-spotlight button').filter(has_text='Royal Milk Mawa')
    btn.click()
    page.wait_for_timeout(3000)

    m_loaded = page.evaluate("""() => {
        const img = document.querySelector('#talbina-spotlight img');
        return { src: img.src, complete: img.complete, nw: img.naturalWidth, nh: img.naturalHeight };
    }""")
    print("Milk Mawa img:", m_loaded)

    b.close()
