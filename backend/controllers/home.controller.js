import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import Testimonial from "../models/testimonial.model.js";
import Campaign from "../models/campaign.model.js";
import Deal from "../models/deal.model.js";

// @desc Get homepage payload
// @route GET /api/home
// @access Public
export const getHome = asyncHandler(async (req, res) => {
  const now = new Date();

  // Hero: single active campaign by priority and date
  const hero = await Campaign.findOne({
    active: true,
    $or: [{ startsAt: { $lte: now } }, { startsAt: null }],
    $or: [{ endsAt: { $gte: now } }, { endsAt: null }],
  })
    .sort({ priority: -1, createdAt: -1 })
    .lean();

  // Trust signals - static for now
  const trustSignals = [
    { key: "fastDelivery", label: "Hızlı Kargo", icon: "truck" },
    { key: "securePayment", label: "Güvenli Ödeme", icon: "shield" },
    { key: "easyReturns", label: "Kolay İade", icon: "repeat" },
    { key: "support", label: "7/24 Destek", icon: "headset" },
  ];

  // Featured categories: top categories by product count (use aggregation)
  const featuredCategories = await Category.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
    { $project: { name: 1, productCount: { $size: "$products" } } },
    { $sort: { productCount: -1 } },
    { $limit: 6 },
  ]);

  // Bestsellers: by numReviews and rating
  const bestsellers = await Product.find()
    .sort({ numReviews: -1, rating: -1 })
    .limit(12)
    .populate("category", "name")
    .lean();

  // Deals: active deals
  const deals = await Deal.find({
    startsAt: { $lte: now },
    endsAt: { $gte: now },
  })
    .populate({
      path: "product",
      populate: { path: "category", select: "name" },
    })
    .lean();

  // New arrivals
  const newArrivals = await Product.find()
    .sort({ createdAt: -1 })
    .limit(12)
    .populate("category", "name")
    .lean();

  // Brands and testimonials
  const brands = await Brand.find().limit(20).lean();
  const testimonials = await Testimonial.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  // Cache the homepage payload for a short period (edge/cdn can override s-maxage)
  res.set(
    "Cache-Control",
    "public, max-age=60, s-maxage=120, stale-while-revalidate=60"
  );

  res.status(200).json({
    success: true,
    data: {
      hero,
      trustSignals,
      featuredCategories,
      bestsellers,
      deals,
      newArrivals,
      brands,
      testimonials,
    },
  });
});
