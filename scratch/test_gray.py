from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.set_content('<div style="background:gray;padding:20px;"><img src="http://localhost:3000/assets/talbina/talbina_milk_mawa.png" id="test"></div>')
    page.wait_for_timeout(2000)
    page.screenshot(path='C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/raw_milk_mawa_on_gray.png')
    print('Saved raw_milk_mawa_on_gray.png')
    b.close()
