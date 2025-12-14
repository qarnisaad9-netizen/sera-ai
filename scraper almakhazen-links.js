export async function updateM5aznProducts() {
  try {
    console.log("M5azn Scraper Started...");

    const products = [
      { id: "p1", name: "Test Product 1", price: 25 },
      { id: "p2", name: "Test Product 2", price: 40 }
    ];

    console.log("Scraper finished successfully — total:", products.length);
    return products;

  } catch (error) {
    console.error("Scraper Error:", error.message);
    return [];
  }
}
