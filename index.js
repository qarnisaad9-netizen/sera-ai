import { AlmakhazenLinks } from './scraper/almakhazen-links.js';

// أضف هذا المسار
app.get('/api/almakhazen/products', async (req, res) => {
  const { q, category = 'العناية بالبشرة' } = req.query;
  
  if (!q) {
    return res.json({
      error: '⚠️ يرجى إدخال اسم المنتج',
      example: '/api/almakhazen/products?q=كريم حب الشباب&category=العناية بالبشرة'
    });
  }
  
  try {
    const result = await AlmakhazenLinks.getProductLinks(q, category);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'حدث خطأ في البحث',
      details: error.message
    });
  }
});