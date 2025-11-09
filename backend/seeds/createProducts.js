import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

// Load backend/.env specifically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Image pools from pexels (direct image URLs). These are example images
// chosen to visually match groups. You can replace or expand these later.
const IMAGE_POOLS = {
  electronics: [
    "https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg",
    "https://images.pexels.com/photos/5082571/pexels-photo-5082571.jpeg",
    "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg",
    "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
    "https://images.pexels.com/photos/18105/pexels-photo.jpg",
  ],
  home: [
    "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
    "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    "https://images.pexels.com/photos/271805/pexels-photo-271805.jpeg",
  ],
  fashion: [
    "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
    "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg",
    "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
  ],
  beauty: [
    "https://images.pexels.com/photos/374886/pexels-photo-374886.jpeg",
    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    "https://images.pexels.com/photos/774866/pexels-photo-774866.jpeg",
  ],
  sports: [
    "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
    "https://images.pexels.com/photos/241260/pexels-photo-241260.jpeg",
    "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
  ],
  kids: [
    "https://images.pexels.com/photos/3662636/pexels-photo-3662636.jpeg",
    "https://images.pexels.com/photos/3662606/pexels-photo-3662606.jpeg",
    "https://images.pexels.com/photos/3662635/pexels-photo-3662635.jpeg",
  ],
  default: [
    "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg",
    "https://images.pexels.com/photos/3765116/pexels-photo-3765116.jpeg",
  ],
};

const GROUP_KEYWORDS = [
  {
    id: "electronics",
    keywords: [
      "telefon",
      "elektronik",
      "tv",
      "televizyon",
      "bilgisayar",
      "laptop",
      "kamera",
    ],
  },
  {
    id: "home",
    keywords: ["ev", "mobilya", "mutfak", "dekor", "bahçe", "yaşam"],
  },
  {
    id: "fashion",
    keywords: ["giyim", "moda", "kıyafet", "ayakkabı", "aksesuar"],
  },
  { id: "beauty", keywords: ["kozmetik", "parfüm", "güzellik", "bakım"] },
  { id: "sports", keywords: ["spor", "fitness", "outdoor", "kamp"] },
  { id: "kids", keywords: ["çocuk", "bebek", "oyuncak"] },
];

function pickImageForCategory(name) {
  const lower = (name || "").toLowerCase();
  const grp = GROUP_KEYWORDS.find((g) =>
    g.keywords.some((kw) => lower.includes(kw))
  );
  const pool = IMAGE_POOLS[grp?.id] || IMAGE_POOLS.default;
  // pick random
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const run = async () => {
  try {
    await connectDB();

    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      console.log(
        "Veritabanında kategori yok. Önce kategori seed'ini çalıştırın (npm run seed-categories)."
      );
      process.exit(1);
    }

    let createdCount = 0;

    for (const cat of categories) {
      // Eğer kategoriye ait ürün varsa atla (idempotent)
      const existing = await Product.findOne({ category: cat._id });
      if (existing) {
        console.log(`Kategori için zaten ürün var, atlanıyor: ${cat.name}`);
        continue;
      }

      // Her kategori için 2-4 ürün oluştur
      const toCreate = randomInt(2, 4);
      for (let i = 1; i <= toCreate; i++) {
        const name = `${cat.name} Model ${i}`;
        const description = `Örnek açıklama: ${cat.name} için kaliteli ve güvenilir ürün. Detaylı bilgi için sayfayı ziyaret edin.`;
        const price = parseFloat((Math.random() * (5000 - 50) + 50).toFixed(2));
        const image = pickImageForCategory(cat.name);
        const stock = randomInt(0, 150);
        const rating = parseFloat((Math.random() * (5 - 3) + 3).toFixed(1));
        const numReviews = randomInt(0, 200);

        const p = await Product.create({
          name,
          description,
          price,
          image,
          category: cat._id,
          stock,
          rating,
          numReviews,
        });
        createdCount++;
        console.log(`Ürün oluşturuldu: ${p.name} (kategori: ${cat.name})`);
      }
    }

    console.log(`Toplam oluşturulan ürün: ${createdCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Ürün seed'lenirken hata:", err);
    process.exit(1);
  }
};

run();
