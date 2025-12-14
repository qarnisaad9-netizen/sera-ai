// scraper/m5azn-playwright.js
import { chromium } from "playwright";

// ضع روابط الأقسام اللي تبغاها هنا
// لازم تكون صفحة فيها منتجات (listing) مو صفحة منتج واحد
const CATEGORY_URLS = {
  skincare: "https://m5azn.com/ar/seller/products", // غيّرها للرابط الصحيح عندك
  makeup: null,
  perfumes: null,
};

function normalizeUrl(href, baseUrl) {
  if (!href) return null;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

function cleanText(t) {
  return (t || "").replace(/\s+/g, " ").trim();
}

function cleanPrice(t) {
  const s = cleanText(t);
  // خذ أرقام فقط (مع فاصلة/نقطة)
  const m = s.match(/[\d.,]+/);
  return m ? m[0] : s;
}

/**
 * يسحب أفضل المنتجات من قسم واحد أو أكثر.
 * @param {Object} opts
 * @param {number} opts.limitPerCategory عدد المنتجات من كل قسم
 * @param {number} opts.maxPages أقصى عدد صفحات لكل قسم
 * @returns {Promise<{ok: boolean, data?: any, error?: string}>}
 */
export async function scrapeBestProducts({ limitPerCategory = 20, maxPages = 3 } = {}) {
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    });

    const page = await context.newPage();
    page.setDefaultTimeout(60000);

    const results = {};
    const categories = Object.entries(CATEGORY_URLS).filter(([, url]) => !!url);

    for (const [category, startUrl] of categories) {
      const items = [];
      let currentPage = 1;
      let nextUrl = startUrl;

      while (nextUrl && currentPage <= maxPages && items.length < limitPerCategory) {
        await page.goto(nextUrl, { waitUntil: "domcontentloaded" });

        // حاول تنتظر أي عنصر يدل على المنتجات (إذا ما ضبط، يكمل)
        await page.waitForTimeout(1500);

        // ⚠️ مهم: هذه السلكترات "عامّة" وقد تحتاج تعديل حسب HTML الحقيقي في m5azn
        // الفكرة: نجمع كروت المنتجات من الصفحة
        const scraped = await page.evaluate(() => {
          const pickText = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();

          // جرب أكثر من نمط لكروت المنتجات
          const possibleCards = [
            ...document.querySelectorAll("a[href*='/product']"),
            ...document.querySelectorAll("[data-product-id]"),
            ...document.querySelectorAll(".product-card, .product-item, .products .item"),
          ];

          // خذ عناصر مميزة بدون تكرار
          const uniq = [];
          const seen = new Set();

          for (const el of possibleCards) {
            // حاول نخلي "card" يكون عنصر مناسب
            const card = el.closest(".product-card, .product-item, .item") || el;
            const hrefEl = card.querySelector("a[href]") || (card.tagName === "A" ? card : null);
            const href = hrefEl?.getAttribute("href") || null;

            // اسم
            const nameEl =
              card.querySelector(".product-title, .title, h3, h2, [class*='title'], [class*='name']") ||
              hrefEl;

            const name = pickText(nameEl);

            // سعر
            const priceEl = card.querySelector(
              ".price, .product-price, [class*='price'], [data-price]"
            );
            const price = pickText(priceEl);

            // صورة
            const imgEl = card.querySelector("img");
            const image = imgEl?.getAttribute("src") || imgEl?.getAttribute("data-src") || null;

            const key = `${name}__${href}__${price}`;
            if (!seen.has(key) && name && href) {
              seen.add(key);
              uniq.push({ name, price, href, image });
            }
          }

          return uniq.slice(0, 60);
        });

        for (const p of scraped) {
          if (items.length >= limitPerCategory) break;

          const url = normalizeUrl(p.href, nextUrl);
          items.push({
            name: cleanText(p.name),
            price: cleanPrice(p.price),
            url,
            image: normalizeUrl(p.image, nextUrl),
            category,
          });
        }

        // حاول نلقى زر/رابط الصفحة التالية (عام)
        const foundNext = await page.evaluate(() => {
          const next =
            document.querySelector("a[rel='next']") ||
            [...document.querySelectorAll("a, button")].find((el) => {
              const t = (el.textContent || "").trim().toLowerCase();
              return t === "التالي" || t === "next" || t.includes("next");
            });

          if (!next) return null;

          // إذا هو رابط
          if (next.tagName === "A") return next.getAttribute("href");

          // إذا زر، نضغطه ونرجع null (بعدين نستخدم URL الحالي)
          if (next.tagName === "BUTTON") {
            next.click();
            return "__BUTTON__";
          }

          return null;
        });

        if (!foundNext) {
          nextUrl = null;
        } else if (foundNext === "__BUTTON__") {
          await page.waitForTimeout(1500);
          nextUrl = page.url();
        } else {
          nextUrl = normalizeUrl(foundNext, nextUrl);
        }

        currentPage += 1;
      }

      results[category] = items;
    }

    return { ok: true, data: results };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}