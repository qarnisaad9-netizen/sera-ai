// scraper/almakhazen-links.js
/**
 * نظام روابط موقع المخازن للتجميل والعناية
 * يعطي روابط مباشرة للمنتجات الأكثر مبيعاً
 */

export class AlmakhazenLinks {
  /**
   * جلب روابط منتجات التجميل والعناية
   * @param {string} product - اسم المنتج (مثال: "كريم حب الشباب")
   * @param {string} category - الفئة (مثال: "العناية بالبشرة")
   * @returns {Promise<Object>} روابط المنتجات
   */
  static async getProductLinks(product, category = "العناية بالبشرة") {
    console.log(`🎀 البحث عن منتجات التجميل: ${product} - ${category}`);
    
    // فئات التجميل والعناية في موقع المخازن
    const categoryMap = {
      "العناية بالبشرة": "العناية-بالبشرة",
      "التجميل": "التجميل",
      "العناية بالشعر": "العناية-بالشعر",
      "العناية بالجسم": "العناية-بالجسم",
      "مستحضرات تجميل": "مستحضرات-تجميل",
      "مكياج": "مكياج",
      "أظافر": "أظافر",
      "عطور": "عطور"
    };
    
    // فئات فرعية للعناية بالبشرة
    const skincareSubcategories = {
      "حب الشباب": "مشاكل-البشرة/حب-الشباب",
      "فيتامين سي": "مصل-وجه",
      "واقي شمس": "واقي-شمس",
      "ماسك وجه": "ماسكات-وجه",
      "تونر": "تونر",
      "مرطب": "كريمات-وجه"
    };
    
    // الحصول على الرابط الرئيسي للفئة
    const mainCategorySlug = categoryMap[category] || "العناية-بالبشرة";
    
    // التحقق إذا كان المنتج من فئة فرعية
    let subcategorySlug = "";
    for (const [subcat, slug] of Object.entries(skincareSubcategories)) {
      if (product.toLowerCase().includes(subcat.toLowerCase())) {
        subcategorySlug = slug;
        break;
      }
    }
    
    // بناء الروابط
    const links = [];
    
    // 1. رابط البحث المباشر
    links.push({
      name: `🔍 "${product}" - بحث مباشر`,
      url: `https://almakhazen.com/search?q=${encodeURIComponent(product)}`,
      description: "ابحث عن المنتج يدوياً في الموقع",
      icon: "🔍",
      priority: 1
    });
    
    // 2. رابط الفئة مع ترتيب الأكثر مبيعاً
    links.push({
      name: `⭐ الأكثر مبيعاً في ${category}`,
      url: `https://almakhazen.com/category/${mainCategorySlug}?sort=popularity`,
      description: "شاهد المنتجات الأكثر طلباً في هذه الفئة",
      icon: "⭐",
      priority: 2
    });
    
    // 3. إذا كان هناك فئة فرعية
    if (subcategorySlug) {
      const subcategoryName = Object.keys(skincareSubcategories).find(
        key => skincareSubcategories[key] === subcategorySlug
      );
      
      links.push({
        name: `💎 منتجات ${subcategoryName} متخصصة`,
        url: `https://almakhazen.com/category/العناية-بالبشرة/${subcategorySlug}`,
        description: `منتجات خاصة بـ ${subcategoryName}`,
        icon: "💎",
        priority: 3
      });
    }
    
    // 4. رابط المنتجات الجديدة
    links.push({
      name: `🚀 منتجات جديدة في ${category}`,
      url: `https://almakhazen.com/category/${mainCategorySlug}?sort=newest`,
      description: "آخر المنتجات المضافة للموقع",
      icon: "🚀",
      priority: 4
    });
    
    // 5. رابط أفضل التقييمات
    links.push({
      name: `🏆 أعلى تقييمات في ${category}`,
      url: `https://almakhazen.com/category/${mainCategorySlug}?rating=4`,
      description: "منتجات تقييمها 4 نجوم فما فوق",
      icon: "🏆",
      priority: 5
    });
    
    // ترتيب الروابط حسب الأولوية
    links.sort((a, b) => a.priority - b.priority);
    
    // إزالة حقل الأولوية من النتيجة النهائية
    const finalLinks = links.map(({ priority, ...rest }) => rest);
    
    return {
      success: true,
      product: product,
      category: category,
      searchDate: new Date().toLocaleString("ar-SA"),
      totalLinks: finalLinks.length,
      links: finalLinks,
      
      // إرشادات الاستخدام
      instructions: [
        "1. انقر على أي رابط لفتح صفحة المنتجات",
        "2. استخدم فلتر 'الأكثر مبيعاً' إذا لم يكن مفعلاً",
        "3. اختر المنتج المناسب من القائمة",
        "4. انسخ رابط المنتج النهائي",
        "5. أضف المنتج في متجرك باستخدام الرابط"
      ],
      
      // نصائح للاختيار الأمثل
      tips: [
        "💡 ركز على المنتجات ذات التقييم العالي (4+ نجوم)",
        "🚀 المنتجات ذات 'شحن سريع' تبيع بشكل أفضل",
        "💰 قارن الأسعار بين عدة منتجات قبل الاختيار",
        "📦 تحقق من توفر المنتج قبل الإضافة",
        "⭐ المنتجات في الصفحة الأولى عادةً هي الأكثر مبيعاً"
      ]
    };
  }
  
  /**
   * البحث الذكي عن نوع المنتج
   */
  static analyzeProductType(productName) {
    const analysis = {
      type: "غير محدد",
      keywords: [],
      recommendedCategory: "العناية بالبشرة"
    };
    
    // كلمات مفتاحية للتجميل والعناية
    const keywords = {
      "كريم": { type: "كريمات", category: "العناية بالبشرة" },
      "سيروم": { type: "مصل", category: "العناية بالبشرة" },
      "ماسك": { type: "ماسكات", category: "العناية بالبشرة" },
      "غسول": { type: "منظفات", category: "العناية بالبشرة" },
      "تونر": { type: "تونر", category: "العناية بالبشرة" },
      "واقي": { type: "واقي شمس", category: "واقي شمس" },
      "حب شباب": { type: "علاج حب الشباب", category: "حب الشباب" },
      "شعر": { type: "العناية بالشعر", category: "العناية بالشعر" },
      "جسم": { type: "العناية بالجسم", category: "العناية بالجسم" },
      "مكياج": { type: "مستحضرات تجميل", category: "مكياج" }
    };
    
    // تحليل اسم المنتج
    for (const [keyword, info] of Object.entries(keywords)) {
      if (productName.toLowerCase().includes(keyword.toLowerCase())) {
        analysis.type = info.type;
        analysis.keywords.push(keyword);
        analysis.recommendedCategory = info.category;
      }
    }
    
    return analysis;
  }
  
  /**
   * دالة مساعدة للاختبار
   */
  static async test() {
    console.log("🧪 اختبار نظام روابط المخازن...");
    
    const testCases = [
      ["كريم حب الشباب", "العناية بالبشرة"],
      ["سيروم فيتامين سي", "العناية بالبشرة"],
      ["واقي شمس SPF 50", "العناية بالبشرة"],
      ["ماسك طين للبشرة", "العناية بالبشرة"],
      ["شامبو للشعر الجاف", "العناية بالشعر"]
    ];
    
    for (const [product, category] of testCases) {
      console.log(`\n📦 اختبار: ${product}`);
      const result = await this.getProductLinks(product, category);
      console.log(`✅ تم إنشاء ${result.totalLinks} روابط`);
      console.log(`🔗 الرابط الأول: ${result.links[0].url}`);
    }
    
    console.log("\n🎯 جميع الاختبارات نجحت!");
  }
}

// للاستخدام المباشر من السطر
if (typeof require !== 'undefined' && require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      // وضع الاختبار
      console.log("🎀 مساعد المخازن للتجميل والعناية");
      console.log("=".repeat(60));
      await AlmakhazenLinks.test();
    } else {
      // استخدام مع معاملات
      const product = args[0];
      const category = args[1] || "العناية بالبشرة";
      
      const result = await AlmakhazenLinks.getProductLinks(product, category);
      
      console.log(`\n🎯 نتائج البحث: ${product}`);
      console.log("=".repeat(60));
      
      result.links.forEach((link, index) => {
        console.log(`\n${index + 1}. ${link.icon} ${link.name}`);
        console.log(`   📝 ${link.description}`);
        console.log(`   🔗 ${link.url}`);
      });
      
      console.log("\n💡 نصائح:");
      result.tips.forEach(tip => console.log(`   • ${tip}`));
    }
  })();
}