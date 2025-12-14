import { chromium } from "playwright-chromium";

export async function scrapeM5aznProducts() {
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://example.com", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const title = await page.title();

    return {
      ok: true,
      message: "Playwright يعمل 100% ✅",
      pageTitle: title,
    };

  } catch (error) {
    console.error("Playwright Error:", error);

    return {
      ok: false,
      error: error.message,
    };

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}