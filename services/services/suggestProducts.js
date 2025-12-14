import { SKIN_CONCERNS } from "../config/skinConcerns.js";
import fetch from "node-fetch";

export async function suggestProducts(concernKey) {
  const rule = SKIN_CONCERNS[concernKey];
  if (!rule) {
    throw new Error("Concern not supported");
  }

  const url = `https://m5azn.com${rule.path}?sort=best_selling`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await res.text();

  // استخراج أسماء وروابط المنتجات (نمط بسيط)
  const matches = [
    ...html.matchAll(/href="([^"]+)"[^>]*class="product-name[^"]*"[^>]*>([^<]+)</g)
  ];

  const products = matches.slice(0, 20).map(m => {
    const link = m[1];
    const name = m[2].trim();

    const brand =
      rule.brands.find(b =>
        name.toLowerCase().includes(b.toLowerCase())
      ) || "Other";

    const type =
      rule.types.find(t =>
        name.toLowerCase().includes(t)
      ) || "other";

    return { name, brand, type, link };
  });

  return products
    .filter(p => rule.brands.includes(p.brand))
    .filter(p => rule.types.includes(p.type))
    .slice(0, 8);
}
