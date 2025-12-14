import { chromium } from "playwright";

export async function scrapeM5aznLinks({ limitPerCategory = 10 } = {}) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  const CATEGORY_URLS = {
    skincare: "https://m5azn.com/ar/seller/products",
  };

  const results = {};

  for (const [category, url] of Object.entries(CATEGORY_URLS)) {
    results[category] = [];

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const links = await page.$$eval("a", (els) =>
      els
        .map((a) => a.href)
        .filter((href) => href && href.includes("/products/"))
    );

    results[category] = [...new Set(links)].slice(0, limitPerCategory);
  }

  await browser.close();
  return results;
}