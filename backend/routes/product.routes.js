import { Router } from "express";
import { body, param, query } from "express-validator";
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
} from "../controllers/product.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = Router();

// /api/products
// Genel rotalar
router
  .route("/")
  .get(getProducts)
  .post(
    // Basit body validation
    body("name")
      .isString()
      .isLength({ min: 3 })
      .withMessage("name en az 3 karakter olmalı"),
    body("price").isNumeric().withMessage("price sayısal olmalı"),
    body("image").isString().withMessage("image gerekli"),
    body("description").isString().withMessage("description gerekli"),
    body("category").isString().withMessage("category ID gerekli"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("stock 0 veya daha büyük integer olmalı"),
    validateRequest,
    protect,
    admin,
    createProduct
  );

// Spesifik rotaların dinamik rotalardan ÖNCE gelmesi önemlidir.
// Yoksa Express 'search' kelimesini bir :id olarak algılayabilir.
router.get(
  "/search",
  [query("q").optional().isString()],
  validateRequest,
  searchProducts
);
router.get(
  "/price-range",
  [query("min").optional().isNumeric(), query("max").optional().isNumeric()],
  validateRequest,
  getProductsByPriceRange
);

// Dinamik ID'li rotalar
router
  .route("/category/:categoryId")
  .get(
    param("categoryId").isString().withMessage("categoryId gerekli"),
    validateRequest,
    getProductsByCategory
  );
router
  .route("/:id/stock")
  .patch(
    param("id").isString().withMessage("id gerekli"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("stock 0 veya daha büyük integer olmalı"),
    validateRequest,
    protect,
    admin,
    updateProductStock
  );

// En sona :id'li temel rotayı koyuyoruz.
router
  .route("/:id")
  .get(getProductById)
  .put(
    // Güncelleme sırasında alanlar opsiyonel, varsa doğrulanır
    param("id").isString().withMessage("id gerekli"),
    body("name")
      .optional()
      .isString()
      .isLength({ min: 3 })
      .withMessage("name en az 3 karakter olmalı"),
    body("price").optional().isNumeric().withMessage("price sayısal olmalı"),
    body("image").optional().isString().withMessage("image gerekli"),
    body("description")
      .optional()
      .isString()
      .withMessage("description gerekli"),
    body("category").optional().isString().withMessage("category ID gerekli"),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("stock 0 veya daha büyük integer olmalı"),
    validateRequest,
    protect,
    admin,
    updateProduct
  )
  .delete(protect, admin, deleteProduct);

export default router;
