import { chromium } from "playwright-chromium";
const CATEGORY_URLS = {
  skincare: "https://m5azn.com/ar/seller/products/filters?event_id=&sorting=&categories%5B%5D=104&categories%5B%5D=102&categories%5B%5D=133&categories%5B%5D=139&categories%5B%5D=181&categories%5B%5D=182&categories%5B%5D=488&categories%5B%5D=491&categories%5B%5D=492&categories%5B%5D=494",
  makeup: null,
  perfumes: null
};

function normalizeUrl(href, baseUrl) {
  if (!href) return null;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

export async function scrapeM5aznLinks({ limitPerCategory = 20 } = {}) {
const browser = await chromium.launch({
  headless: true,
  executablePath: chromium.executablePath(),
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});
  const page = await browser.newPage();

  const result = {
    skincare: [],
    makeup: [],
    perfumes: [],
  };

  try {
    for (const [key, url] of Object.entries(CATEGORY_URLS)) {
      if (!url) continue;

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1500);

      const products = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll("a[href]"));
        return cards.map(a => ({
          name: a.innerText.trim(),
          url: a.href
        })).filter(p => p.name && p.url);
      });

      const unique = [];
      const seen = new Set();

      for (const p of products) {
        if (seen.has(p.url)) continue;
        seen.add(p.url);
        unique.push(p);
        if (unique.length >= 20) break;
      }

      result[key] = unique;
    }
  } finally {
    await page.close();
    await browser.close();
  }

  return result;
}
