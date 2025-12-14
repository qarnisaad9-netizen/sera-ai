import { chromium } from "playwright";

export async function scrapeM5azn() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://m5azn.com", {
    waitUntil: "domcontentloaded",
    timeout: 60000
  });

  const title = await page.title();

  await browser.close();

  return {
    ok: true,
    title
  };
}