export async function updateM5aznProducts() {
  try {
    console.log("M5AZN scraper started...");

    // اختبار بسيط للتأكد أن السكريبر يعمل
    return {
      success: true,
      message: "Test scraper is working",
    };

  } catch (error) {
    console.error("Scraper error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
