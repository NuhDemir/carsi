import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import Category from "../models/category.model.js";

// Load backend/.env specifically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const categoriesToCreate = [
  { name: "Cep Telefonu", description: "Akıllı telefonlar ve aksesuarları" },
  {
    name: "Laptop & Bilgisayar",
    description: "Dizüstü, masaüstü bilgisayarlar ve çevre birimleri",
  },
  {
    name: "Televizyon & Görüntü",
    description: "Televizyonlar, projeksiyon ve aksesuarlar",
  },
  {
    name: "Fotoğraf & Kamera",
    description: "Kameralar, lensler ve fotoğraf ekipmanları",
  },
  {
    name: "Ev Elektroniği",
    description: "Küçük ev aletleri ve elektrikli ürünler",
  },

  {
    name: "Mobilya",
    description: "Oturma grupları, yatak odası, mutfak mobilyaları",
  },
  {
    name: "Ev Dekorasyonu",
    description: "Dekoratif ürünler, tekstil ve aydınlatma",
  },
  {
    name: "Mutfak Gereçleri",
    description: "Tencere, tava, mutfak aletleri ve servis ürünleri",
  },

  {
    name: "Kadın Giyim",
    description: "Kadın kıyafetleri, elbiseler, üstler ve altlar",
  },
  {
    name: "Erkek Giyim",
    description: "Erkek giyim, kruvaze, gömlek ve pantolonlar",
  },
  {
    name: "Ayakkabı",
    description: "Spor ayakkabılar, günlük ve özel ayakkabılar",
  },
  { name: "Aksesuar", description: "Çanta, saat, takı ve günlük aksesuarlar" },

  {
    name: "Kozmetik & Kişisel Bakım",
    description: "Makyaj, cilt bakımı ve kişisel bakım ürünleri",
  },
  { name: "Parfüm", description: "Kadın ve erkek parfümleri" },

  {
    name: "Spor & Outdoor",
    description: "Spor ekipmanları, outdoor ve kamp malzemeleri",
  },
  {
    name: "Fitness Ekipmanları",
    description: "Ev için fitness aletleri ve aksesuarlar",
  },

  {
    name: "Bebek & Çocuk",
    description: "Bebek bakım ürünleri, oyuncaklar ve çocuk giyimi",
  },
  {
    name: "Oyuncaklar",
    description: "Eğitici oyuncaklar, figürler ve oyun setleri",
  },
  {
    name: "Oyun & Konsol",
    description: "Oyun konsolları, oyun ve aksesuarları",
  },
];

const run = async () => {
  try {
    await connectDB();

    for (const c of categoriesToCreate) {
      const exists = await Category.findOne({ name: c.name });
      if (exists) {
        console.log(`Kategori zaten var: ${c.name}`);
        continue;
      }
      const created = await Category.create(c);
      console.log(`Kategori eklendi: ${created.name} (id: ${created._id})`);
    }

    console.log("Tüm kategoriler işlendi.");
    process.exit(0);
  } catch (err) {
    console.error("Kategori eklenirken hata:", err);
    process.exit(1);
  }
};

run();
