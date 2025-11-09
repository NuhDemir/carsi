import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import Campaign from "../models/campaign.model.js";
import Brand from "../models/brand.model.js";
import Testimonial from "../models/testimonial.model.js";
import Deal from "../models/deal.model.js";
import Product from "../models/product.model.js";

// Load backend/.env specifically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const run = async () => {
  try {
    await connectDB();

    // --- Brands ---
    const brandsData = [
      {
        name: "Anatolia Goods",
        logo: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&h=200&w=200",
        website: "https://example.com",
      },
      {
        name: "Bazar Co.",
        logo: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&h=200&w=200",
      },
      {
        name: "RetroWear",
        logo: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&h=200&w=200",
      },
    ];

    for (const b of brandsData) {
      const exists = await Brand.findOne({ name: b.name });
      if (!exists) {
        await Brand.create(b);
        console.log("Brand created:", b.name);
      } else {
        console.log("Brand exists:", b.name);
      }
    }

    // --- Campaigns (Hero) ---
    const heroData = {
      title: "Büyük Sonbahar İndirimi",
      subtitle:
        "Seçili ürünlerde %50’ye varan indirimler. Stoklarla sınırlıdır!",
      ctaText: "İndirimleri Gör",
      ctaUrl: "/explore",
      image:
        "https://images.pexels.com/photos/374021/pexels-photo-374021.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200",
      active: true,
      priority: 10,
      startsAt: new Date(Date.now() - 1000 * 60 * 60),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    };

    const existingHero = await Campaign.findOne({ title: heroData.title });
    if (!existingHero) {
      await Campaign.create(heroData);
      console.log("Hero campaign created");
    } else {
      console.log("Hero campaign exists");
    }

    // --- Testimonials ---
    const sampleTestimonials = [
      {
        name: "Ayşe Y.",
        text: "Harika ürünler ve çok hızlı kargo. Kesinlikle tavsiye ederim!",
        rating: 5,
        image:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&h=200&w=200",
      },
      {
        name: "Mehmet K.",
        text: "Müşteri hizmetleri çok ilgiliydi, iade süreci sorunsuzdu.",
        rating: 5,
      },
      {
        name: "Elif D.",
        text: "Fiyat/performans çok iyi, tekrar alırım.",
        rating: 4,
      },
    ];

    for (const t of sampleTestimonials) {
      const exists = await Testimonial.findOne({ name: t.name, text: t.text });
      if (!exists) {
        // Optionally attach to a product randomly
        const prod = await Product.findOne().lean();
        const doc = { ...t };
        if (prod) doc.product = prod._id;
        await Testimonial.create(doc);
        console.log("Testimonial created:", t.name);
      } else {
        console.log("Testimonial exists:", t.name);
      }
    }

    // --- Deals ---
    // Create deals for up to 6 products if they don't already have one
    const products = await Product.find().limit(12).lean();
    const now = Date.now();
    for (let i = 0; i < Math.min(products.length, 6); i++) {
      const p = products[i];
      const discount = 10 + i * 5; // 10%, 15%, ...
      const startsAt = new Date(now - 1000 * 60 * 60);
      const endsAt = new Date(now + 1000 * 60 * 60 * 24 * (2 + i));
      const exists = await Deal.findOne({ product: p._id });
      if (!exists) {
        await Deal.create({
          product: p._id,
          discountPercent: discount,
          startsAt,
          endsAt,
          limitedStock: Math.max(5, Math.floor(p.stock / 4)),
        });
        console.log("Deal created for product:", p._id);
      } else {
        console.log("Deal exists for product:", p._id);
      }
    }

    console.log("Home seeds completed.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding home data failed:", err);
    process.exit(1);
  }
};

run();
