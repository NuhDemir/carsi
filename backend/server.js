// backend/src/server.js

// Ensure environment variables are loaded from backend/.env (load explicitly so
// running `node backend/server.js` from project root still picks the correct file)
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import app from "./app.js";

// PORT değişkeni .env dosyasından app.js içinde zaten okunmuş olmalı.
// Load .env located next to this file (backend/.env)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Sunucu ➜ http://localhost:${PORT}`);
      console.log(`Çalışma Modu: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Sunucu başlatılırken bir hata oluştu:", error);
    process.exit(1); // Hata durumunda uygulamayı sonlandır
  }
};

startServer();
