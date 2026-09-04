from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto('http://localhost:3000/assets/talbina/talbina_milk_mawa.png')
    page.screenshot(path='C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/direct_image_view.png')
    print('Direct image loaded, URL:', page.url)
    b.close()
