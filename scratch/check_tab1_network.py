from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto('http://localhost:3000/#/')
    page.wait_for_timeout(2000)

    page.on("request", lambda r: print("REQ:", r.url))
    page.on("response", lambda r: print("RES:", r.status, r.url))
    page.on("requestfailed", lambda r: print("FAIL:", r.url, r.failure))

    btn = page.locator("#talbina-spotlight button").filter(has_text="Royal Milk Mawa")
    print("CLICKING...")
    btn.click()
    page.wait_for_timeout(3000)

    img_info = page.evaluate("""() => {
        const img = document.querySelector('#talbina-spotlight img');
        return {
            src: img.src,
            currentSrc: img.currentSrc,
            complete: img.complete,
            nw: img.naturalWidth,
            nh: img.naturalHeight
        };
    }""")
    print("IMG INFO:", img_info)
    b.close()
