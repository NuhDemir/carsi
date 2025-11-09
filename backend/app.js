// backend/src/app.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";

import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js";
import homeRoutes from "./routes/home.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import mongoose from "mongoose";

// Komut kök dizinden çalıştırıldığı için, dotenv yolu otomatik olarak bulur.
dotenv.config();

const app = express();

// Güvenlik başlıkları
app.use(helmet());

// Request logging (development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// CORS: frontend URL veya geliştirme varsayılanı
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: frontendUrl }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);

// Health-check endpoint: DB durumunu ve uygulama env bilgisini döner
app.get("/api/health", (req, res) => {
  const dbState =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    ok: true,
    db: dbState,
    env: process.env.NODE_ENV || "development",
  });
});

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  // Frontend build klasörünün yolunu doğru bir şekilde oluştur
  const frontendDistPath = path.join(__dirname, "frontend", "dist");

  // Statik dosyaları sun
  app.use(express.static(frontendDistPath));

  // Diğer tüm istekleri index.html'e yönlendir
  app.get("*", (req, res) =>
    res.sendFile(path.join(frontendDistPath, "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API geliştirme modunda çalışıyor...");
  });
}

app.use(errorHandler);

export default app;
