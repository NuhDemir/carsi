import { Router } from 'express';
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getProductsByPriceRange,
  updateProductStock,
} from '../controllers/product.controller.js';

// İleride eklenecek yetkilendirme middleware'leri için
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// /api/products
// Genel rotalar
router.route('/').get(getProducts).post(/*protect, admin,*/ createProduct);

// Spesifik rotaların dinamik rotalardan ÖNCE gelmesi önemlidir.
// Yoksa Express 'search' kelimesini bir :id olarak algılayabilir.
router.get('/search', searchProducts);
router.get('/price-range', getProductsByPriceRange);

// Dinamik ID'li rotalar
router.route('/category/:categoryId').get(getProductsByCategory);
router.route('/:id/stock').patch(/*protect, admin,*/ updateProductStock);

// En sona :id'li temel rotayı koyuyoruz.
router
  .route('/:id')
  .get(getProductById)
  .put(/*protect, admin,*/ updateProduct)
  .delete(/*protect, admin,*/ deleteProduct);

export default router;