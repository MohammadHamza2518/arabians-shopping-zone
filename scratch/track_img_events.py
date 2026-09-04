from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto('http://localhost:3000/#/')
    page.wait_for_timeout(2000)

    # Attach listeners in page before clicking
    page.evaluate("""() => {
        window.__imgEvents = [];
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.tagName === 'IMG' || (node.querySelector && node.querySelector('img'))) {
                        const img = node.tagName === 'IMG' ? node : node.querySelector('img');
                        window.__imgEvents.push('IMG ADDED: ' + img.src);
                        img.addEventListener('load', () => window.__imgEvents.push('LOADED: ' + img.src + ' ' + img.naturalWidth));
                        img.addEventListener('error', (e) => window.__imgEvents.push('ERROR: ' + img.src));
                    }
                }
            }
        });
        const container = document.querySelector('#talbina-spotlight');
        if (container) observer.observe(container, { childList: true, subtree: true });
    }""")

    # Click Royal Milk Mawa
    btn = page.locator('#talbina-spotlight button').filter(has_text='Royal Milk Mawa')
    btn.click()
    page.wait_for_timeout(3000)

    events = page.evaluate("() => window.__imgEvents")
    print("Image Events:", events)
    b.close()
