import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../config/db.js";
import User from "../models/user.model.js";

// Load backend/.env specifically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const run = async () => {
  try {
    await connectDB();

    const adminName = process.env.ADMIN_NAME || "Admin";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log(`Admin kullanıcı zaten var: ${adminEmail}`);
      process.exit(0);
    }

    const user = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      isAdmin: true,
    });
    console.log("Admin kullanıcı oluşturuldu:", {
      id: user._id,
      email: user.email,
    });
    console.log(
      "Önemli: Oluşturulan admin parolasını güvenli bir yere not edin."
    );
    process.exit(0);
  } catch (err) {
    console.error("Admin oluşturulurken hata:", err);
    process.exit(1);
  }
};

run();
