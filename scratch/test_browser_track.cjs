const { chromium } = require('playwright');

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:3000/#/track', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Type 1089 into search
  await page.fill("input[type='text']", '1089');
  await page.click("button:has-text('Track Parcel')");
  await page.waitForTimeout(2000);

  const bodyText = await page.locator('body').innerText();
  console.log('Includes ASZ-1089?', bodyText.includes('ASZ-1089'));
  console.log('Includes BlueDart?', bodyText.includes('BlueDart'));
  console.log('Includes Carrier Portal button?', bodyText.includes('Official BlueDart'));

  await page.screenshot({ path: 'C:/Users/moham/.gemini/antigravity/brain/39f53ab6-18ce-4096-8de7-56ea97e98c3b/verified_track_portal_desktop.png' });
  console.log('Saved verified_track_portal_desktop.png');

  await browser.close();
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
