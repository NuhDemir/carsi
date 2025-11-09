import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js"; // Kategori kontrolü için gerekli olabilir

// @desc    Tüm ürünleri veya bir kategoriye ait ürünleri getir
// @route   GET /api/products
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  // Pagination: ?page=1&limit=10
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // İsteğe bağlı filtreler
  const filters = {};
  if (req.query.category) {
    filters.category = req.query.category;
  }
  if (req.query.minPrice)
    filters.price = {
      ...(filters.price || {}),
      $gte: Number(req.query.minPrice),
    };
  if (req.query.maxPrice)
    filters.price = {
      ...(filters.price || {}),
      $lte: Number(req.query.maxPrice),
    };

  const total = await Product.countDocuments(filters);

  const products = await Product.find(filters)
    .populate("category", "name") // Kategori bilgisini (sadece ismini) ekle
    .sort({ createdAt: -1 }) // En yeni ürünler üstte
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: products,
  });
});

// @desc    Tek bir ürünü ID ile getir
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Geçersiz ürün IDsi.");
  }

  const product = await Product.findById(id).populate("category", "name");

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error("Ürün bulunamadı.");
  }
});

// @desc    Yeni bir ürün oluştur
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  // Modelimizde daha fazla alan olduğu için body'yi güncelliyoruz
  const { name, price, image, description, category, stock } = req.body;

  // Temel doğrulama
  if (
    !name ||
    !price ||
    !image ||
    !description ||
    !category ||
    stock === undefined
  ) {
    res.status(400);
    throw new Error("Lütfen tüm zorunlu alanları doldurun.");
  }

  // Kategori ID'sinin geçerli olup olmadığını kontrol et
  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error("Geçersiz kategori IDsi.");
  }
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    res.status(404);
    throw new Error("Belirtilen kategori bulunamadı.");
  }

  const product = new Product({
    name,
    price,
    image,
    description,
    category,
    stock,
    // numReviews ve rating varsayılan değerlerini alacak
  });

  const createdProduct = await product.save();
  const populatedProduct = await createdProduct.populate("category", "name"); // Cevapta kategori adını da gönder
  res.status(201).json(populatedProduct);
});

// @desc    Bir ürünü güncelle
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, image, description, category, stock } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Geçersiz ürün IDsi.");
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Ürün bulunamadı.");
  }

  // Güncelleme
  product.name = name || product.name;
  product.price = price || product.price;
  product.image = image || product.image;
  product.description = description || product.description;
  product.category = category || product.category;
  product.stock = stock !== undefined ? stock : product.stock;

  const updatedProduct = await product.save();
  const populatedProduct = await updatedProduct.populate("category", "name");
  res.status(200).json(populatedProduct);
});

// @desc    Bir ürünü sil
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Geçersiz ürün IDsi.");
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404);
    throw new Error("Silinecek ürün bulunamadı.");
  }

  res.status(200).json({ id: product._id, message: "Ürün başarıyla silindi." });
});

// @desc    Ürünleri anahtar kelimeye göre ara
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.status(200).json({ success: true, data: [] });
  }

  // Eğer text index mevcutsa kullan; yoksa regex ile fallback
  let products;
  try {
    products = await Product.find({ $text: { $search: q } }).populate(
      "category",
      "name"
    );
    // Eğer text search sonuç vermediyse veya text index yoksa boş dönebilir -> fallback
    if (!products || products.length === 0) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      products = await Product.find({
        $or: [{ name: regex }, { description: regex }],
      }).populate("category", "name");
    }
  } catch (err) {
    // text index yoksa MongoError gelebilir; fallback olarak regex dene
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    products = await Product.find({
      $or: [{ name: regex }, { description: regex }],
    }).populate("category", "name");
  }

  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
});

// @desc    Ürünleri kategoriye göre filtrele
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.status(400);
    throw new Error("Geçersiz kategori IDsi.");
  }

  const products = await Product.find({ category: categoryId })
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(products);
});

// @desc    Ürünleri fiyat aralığına göre getir
// @route   GET /api/products/price-range
// @access  Public
export const getProductsByPriceRange = asyncHandler(async (req, res) => {
  const { min, max } = req.query;

  const minPrice = Number(min) || 0;
  const maxPrice = Number(max) || Infinity;

  const products = await Product.find({
    price: { $gte: minPrice, $lte: maxPrice },
  })
    .populate("category", "name")
    .sort({ price: 1 }); // Fiyata göre artan sırala

  res.status(200).json(products);
});

// @desc    Bir ürünün stoğunu güncelle
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
export const updateProductStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Geçersiz ürün IDsi.");
  }

  if (stock === undefined || Number(stock) < 0) {
    res.status(400);
    throw new Error("Geçerli bir stok değeri girilmelidir.");
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Ürün bulunamadı.");
  }

  product.stock = stock;
  const updatedProduct = await product.save();
  const populatedProduct = await updatedProduct.populate("category", "name");

  res.status(200).json(populatedProduct);
});
