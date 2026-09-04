from playwright.sync_api import sync_playwright
import base64

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto('http://localhost:3000/#/')
    page.wait_for_timeout(2000)

    btn = page.locator('#talbina-spotlight button').filter(has_text='Royal Milk Mawa')
    btn.click()
    page.wait_for_timeout(2000)

    data_url = page.evaluate("""() => {
        const img = document.querySelector('#talbina-spotlight img');
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 100;
        canvas.height = img.naturalHeight || 100;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL('image/png');
    }""")

    header, encoded = data_url.split(",", 1)
    data = base64.b64decode(encoded)
    with open('C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/canvas_milk_mawa.png', 'wb') as f:
        f.write(data)
    print("Wrote canvas_milk_mawa.png, length:", len(data))
    b.close()
