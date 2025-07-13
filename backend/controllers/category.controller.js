// backend/src/controllers/category.controller.js
import asyncHandler from 'express-async-handler';
import Category from '../models/category.model.js';
import Product from '../models/product.model.js'; // Product modelini import et

// @desc    Tüm kategorileri ve her birine ait ürün sayısını getir
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  // MongoDB Aggregation Pipeline
  const categoriesWithProductCount = await Category.aggregate([
    {
      // 1. Adım: Product koleksiyonu ile 'join' işlemi yap
      $lookup: {
        from: 'products', // 'products' koleksiyonuna bak
        localField: '_id', // Category koleksiyonundaki '_id' alanı
        foreignField: 'category', // Product koleksiyonundaki 'category' alanı
        as: 'products', // Eşleşen ürünleri 'products' adında bir diziye ata
      },
    },
    {
      // 2. Adım: Yeni alanlar ekle ve gereksizleri kaldır
      $project: {
        _id: 1, // id'yi koru
        name: 1, // name'i koru
        description: 1, // description'ı koru
        createdAt: 1, // createdAt'i koru
        productCount: { $size: '$products' }, // 'products' dizisinin boyutunu (eleman sayısını) al
      },
    },
    {
        // 3. Adım: En çok ürünü olan kategoriyi üste al
        $sort: { productCount: -1 }
    }
  ]);

  res.status(200).json(categoriesWithProductCount);
});


// @desc    Yeni bir kategori oluştur
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Kategori adı zorunludur.');
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Bu kategori zaten mevcut.');
  }

  const category = await Category.create({
    name,
    description,
  });

  res.status(201).json(category);
});