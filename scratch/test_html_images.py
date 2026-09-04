from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    html = """
    <!DOCTYPE html>
    <html><body>
    <img id="i1" src="http://localhost:3000/assets/talbina/talbina_vanilla_dryfruits.jpg">
    <img id="i2" src="http://localhost:3000/assets/talbina/talbina_milk_mawa.jpg">
    <img id="i3" src="http://localhost:3000/assets/talbina/talbina_chocolate_kids.jpg">
    </body></html>
    """
    page.set_content(html)
    page.wait_for_timeout(2000)
    for i in ['i1', 'i2', 'i3']:
        res = page.evaluate(f"() => {{ const el = document.getElementById('{i}'); return {{ id: el.id, complete: el.complete, nw: el.naturalWidth }}; }}")
        print(res)
    b.close()
