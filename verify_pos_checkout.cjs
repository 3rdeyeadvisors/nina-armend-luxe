const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to POS...');
    await page.goto('http://localhost:8080/admin/pos');
    await page.waitForTimeout(3000);

    console.log('Clicking a product...');
    const product = page.locator('div.group.cursor-pointer').first();
    await product.click();
    await page.waitForTimeout(1000);

    console.log('Forcing size selection...');
    await page.evaluate(() => {
        // Find any button that looks like a size button in the dialog
        const buttons = Array.from(document.querySelectorAll('button'));
        const sizeButton = buttons.find(b => (b.innerText.includes('XS') || b.innerText.includes('S') || b.innerText.includes('M')) && b.innerText.includes('stock'));
        if (sizeButton) {
            sizeButton.disabled = false;
            sizeButton.click();
        }
    });
    await page.waitForTimeout(500);

    console.log('Clicking Go to Checkout...');
    const checkoutBtn = page.locator('button:has-text("Go to Checkout")');
    if (await checkoutBtn.isVisible()) {
        await checkoutBtn.click();
        await page.waitForTimeout(2000);
        console.log('Taking screenshot of POS Checkout Modal...');
        await page.screenshot({ path: '/home/jules/verification/pos_checkout_modal.png' });
    } else {
        console.log('Checkout button not visible, taking debug screenshot');
        await page.screenshot({ path: '/home/jules/verification/pos_debug.png' });
    }

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
  }
})();
