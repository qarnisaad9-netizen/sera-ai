import fetch from "node-fetch";

/**
 * تحديث منتجات المخازن (نسخة بدون Playwright)
 */
export async function updateM5aznProducts() {
  try {
    const url = "https://api.m5azn.com/products"; // مثال – نعدله لاحقًا

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "SERA-AI-Bot",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch M5azn products");
    }

    const data = await response.json();

    return {
      ok: true,
      count: Array.isArray(data) ? data.length : 0,
      data
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
}