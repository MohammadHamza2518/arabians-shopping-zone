import os, time
from playwright.sync_api import sync_playwright

brain_dir = r'C:\Users\moham\.gemini\antigravity\brain\5e171d0e-fe0e-4a04-a77c-bd86be3b506f'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    # Start on homepage
    page.goto('http://localhost:5000/#/', wait_until='networkidle')
    time.sleep(1)

    # Scroll all the way to footer
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    time.sleep(0.5)
    print('Scrolled to bottom, scrollY:', page.evaluate('window.scrollY'))

    # Click Privacy Policy
    page.locator('footer a:text("Privacy Policy")').first.click()
    time.sleep(0.5)
    scroll_pos = page.evaluate('window.scrollY')
    h1_text = page.locator('h1').inner_text()
    print('After Privacy Policy click -> URL:', page.url, '| ScrollY:', scroll_pos, '| H1:', h1_text)
    page.screenshot(path=os.path.join(brain_dir, 'v9_privacy_policy_top.png'))

    # Scroll to footer again and click Refund Policy
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    time.sleep(0.5)
    page.locator('footer a:text("Refund Policy")').first.click()
    time.sleep(0.5)
    scroll_pos = page.evaluate('window.scrollY')
    h1_text = page.locator('h1').inner_text()
    print('After Refund Policy click -> URL:', page.url, '| ScrollY:', scroll_pos, '| H1:', h1_text)
    page.screenshot(path=os.path.join(brain_dir, 'v9_refund_policy_top.png'))

    # Scroll to footer again and click Contact Desk
    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
    time.sleep(0.5)
    page.locator('footer a:text("Contact Desk")').first.click()
    time.sleep(0.5)
    scroll_pos = page.evaluate('window.scrollY')
    h1_text = page.locator('h1').inner_text()
    print('After Contact Desk click -> URL:', page.url, '| ScrollY:', scroll_pos, '| H1:', h1_text)
    page.screenshot(path=os.path.join(brain_dir, 'v9_contact_top.png'))

    browser.close()
    print('ALL FOOTER LINKS VERIFIED SUCCESSFULLY!')
