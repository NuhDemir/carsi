// backend/src/config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error(
        "MONGO_URI environment variable is not set. Lütfen backend/.env dosyasını kontrol edin."
      );
      process.exit(1);
    }

    // Bağlantı seçenekleri: zaman aşımı ve IPv4 tercih (bazı DNS/SRV sorunlarında yardımcı olur)
    const connectOptions = {
      // Mongoose v6+ varsayılan olarak useNewUrlParser/useUnifiedTopology aktif
      serverSelectionTimeoutMS: 10000, // Sunucu seçimi için bekleme süresi
      connectTimeoutMS: 10000, // TCP bağlantı zaman aşımı
      socketTimeoutMS: 45000,
      family: 4, // IPv4 kullanmayı zorla; bazı ortamlarda DNS SRV sorunlarına yardımcı olur
    };

    // Retry mantığı: geçici DNS/Network hatalarında birkaç kez dene
    const maxRetries = 4;
    let attempt = 0;
    let lastErr;

    while (attempt <= maxRetries) {
      try {
        const conn = await mongoose.connect(
          process.env.MONGO_URI,
          connectOptions
        );
        console.log(`MongoDB ➜ ${conn.connection.host}`);
        return conn;
      } catch (err) {
        lastErr = err;
        attempt += 1;
        console.error(
          `Mongo bağlantı denemesi ${attempt}/${maxRetries + 1} başarısız:`,
          err.message || err
        );

        // Eğer son denemeyse döngüden çık ve hatayı işle
        if (attempt > maxRetries) break;

        // Eğer DNS SRV (mongodb+srv) ile ilgili timeout veya querySrv hatasıysa, ip adresi beyaz liste veya DNS sorunlarını kontrol edin
        if (err.message && err.message.includes("querySrv")) {
          console.error(
            "DNS SRV sorgusunda timeout oluştu. Muhtemel sebepler: internet bağlantısı, DNS yapılandırması veya MongoDB Atlas Network Access (IP whitelist) ayarları."
          );
        }

        // Basit exponential backoff
        const backoff = 1000 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }

    // Eğer buraya geldiyse bağlantı kurulamadı
    console.error("Mongo bağlantısı kurulamadı. Son hata:", lastErr);
    // Öneriler
    console.error(
      "- 1) `backend/.env` içindeki MONGO_URI değerinin doğru ve tam olduğundan emin olun (ör. mongodb+srv://user:pass@cluster0.../dbname)."
    );
    console.error(
      "- 2) MongoDB Atlas kullanıyorsanız, IP Access List (Network Access) bölümüne makinenizin IP adresini ekleyin veya geçici test için 0.0.0.0/0 ekleyin."
    );
    console.error(
      "- 3) DNS SRV sorgularında problemler yaşıyorsanız `family:4` seçeneğini kullanmayı veya mongodb:// (SRV olmayan) bağlantı stringi ile deneyin."
    );
    console.error(
      "- 4) Eğer corporate VPN/firewall kullanıyorsanız, DNS ve outbound 27017/27015 portlarının erişilebilir olduğunu doğrulayın."
    );
    process.exit(1);
  } catch (err) {
    console.error("Mongo bağlantı hatası (beklenmeyen):", err);
    process.exit(1);
  }
};
