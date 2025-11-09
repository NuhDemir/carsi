import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const pexelsIds = [
  374021, 3184292, 3184418, 2983464, 415829, 428333, 257360, 2669661, 3651556,
  279788, 1640777, 3650047, 936046, 19090, 1236701, 3222072, 373965, 1261728,
  1287562, 414886, 206434, 325185, 1540777, 208817, 2698519, 1542085, 1666026,
  2528115, 1656679, 2100063, 261187, 2335126, 27411, 302804, 132037, 3029029,
  338504, 1571450, 1439226, 179909, 305974, 2573601, 279916, 291762, 330857,
  326119, 1124466, 395198, 343520, 347141, 356043, 373491, 374074, 376025,
  381079, 382738, 385539, 386148, 390034, 395196, 397035, 399321, 400946,
  401071, 404880, 408503, 410071, 412671, 416430, 418375, 420205, 422125,
  424582, 426018, 427743, 429036, 430927, 432159, 433282, 435021, 436599,
  438365, 440219, 441164, 443413, 444016, 445386, 446278, 447361, 448280,
  449589, 450467, 452961, 454918, 456215, 457882, 459225, 460121, 461428,
  462805, 464272, 465204, 466675, 468403, 469202, 470273, 471134, 472123,
  473365, 474321,
];

const adjectives = [
  "Pamuklu",
  "Retro",
  "El yapımı",
  "Minimal",
  "Klasik",
  "Şık",
  "Fonksiyonel",
  "Rahat",
  "Dayanıklı",
  "Çevre dostu",
];

const types = [
  "Tişört",
  "Mutfak Seti",
  "Seramik Kupa",
  "Sırt Çantası",
  "Hasır Sepet",
  "Ahşap Kesme Tahtası",
  "Kanvas Poster",
  "Pamuklu Yastık",
  "Pursak Kolye",
  "Derin Tencere",
  "Bahçe Eldiveni",
  "Sokak Lambası",
  "Bisiklet Lambası",
  "Pijama Takımı",
  "Günlük Defter",
  "Çocuk Oyuncağı",
  "Kahve Öğütücü",
  "Masa Lambası",
  "Sıcak Su Torbası",
  "Seyahat Cüzdanı",
];

const materials = [
  "organik pamuk",
  "seramik",
  "kullanışlı ahşap",
  "mermer desenli",
  "yumuşak ipek dokulu",
  "kanvas",
  "mat metal",
  "el örmesi",
  "natürel keten",
  "geri dönüştürülmüş plastik",
];

const descriptions = [
  "Günlük kullanım için ideal, konforlu ve şık bir ürün. Uzun ömürlü malzeme ve özenli işçilik.",
  "Minimal tasarımı ile her ortama uyum sağlar; temizlemesi kolay ve dayanıklıdır.",
  "Hediyelik olarak da çok tercih edilen, kaliteli malzemeden üretilmiş bir örnek.",
  "Ergonomik yapısı sayesinde kullanım rahatlığı sağlar, estetik dokunuşlarla tamamlanmıştır.",
  "Sürdürülebilir kaynaklardan üretilmiş, çevre dostu bir seçenek.",
];

const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

const ensureCategories = async () => {
  let cats = await Category.find().lean();
  if (!cats || cats.length === 0) {
    const defaults = [
      { name: "Giyim", description: "Erkek & kadın giyim ürünleri." },
      {
        name: "Ev & Yaşam",
        description: "Ev için dekorasyon ve yaşam ürünleri.",
      },
      {
        name: "Mutfak",
        description: "Mutfak araç-gereçleri ve sofra ürünleri.",
      },
      { name: "Aksesuar", description: "Günlük aksesuar ve takılar." },
      { name: "Elektronik", description: "Küçük ev aletleri ve aksesuarlar." },
      { name: "Spor & Outdoor", description: "Spor ve açık hava ekipmanları." },
      { name: "Çocuk", description: "Çocuk ve bebek ürünleri." },
      { name: "Kozmetik", description: "Kişisel bakım ve kozmetik ürünleri." },
      {
        name: "Ofis & Kırtasiye",
        description: "Kırtasiye ve ofis malzemeleri.",
      },
      { name: "Bahçe", description: "Bahçe bakım ürünleri." },
    ];
    const inserted = await Category.insertMany(defaults);
    cats = inserted.map((c) => ({ ...c }));
    console.log(
      "Varsayılan kategoriler oluşturuldu:",
      cats.map((c) => c.name).join(", ")
    );
  }
  return cats;
};

const run = async () => {
  try {
    await connectDB();
    const categories = await ensureCategories();

    for (let i = 0; i < 100; i++) {
      const cat = categories[i % categories.length];

      const adj = adjectives[i % adjectives.length];
      const type = types[i % types.length];
      const mat = materials[i % materials.length];
      const desc = descriptions[i % descriptions.length];

      const name = `${adj} ${type} — ${mat} (${cat.name}) #${i + 1}`;
      const description =
        `${desc} Bu ürün ${cat.name} kategorisinde yer alır ve ${mat} malzemesi kullanılarak üretilmiştir. ` +
        "Özellikleri: konforlu, dayanıklı ve şık tasarım.";

      const price = randomFloat(9.99, 499.99);
      const stock = randomBetween(0, 200);
      const rating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 - 5.0
      const numReviews = randomBetween(0, 500);

      const pexelsId = pexelsIds[i % pexelsIds.length];
      const image = `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200`;

      // idempotent: eğer aynı isimde ürün varsa atla
      const exists = await Product.findOne({ name });
      if (exists) {
        console.log(`Atlandı (mevcut): ${name}`);
        continue;
      }

      await Product.create({
        name,
        description,
        price,
        image,
        category: cat._id,
        stock,
        rating,
        numReviews,
      });
      console.log("Oluşturuldu:", name);
    }

    console.log("100 ürün seed tamamlandı.");
    process.exit(0);
  } catch (err) {
    console.error("Ürün seed hatası:", err);
    process.exit(1);
  }
};

run();
