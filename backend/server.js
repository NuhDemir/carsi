// backend/src/server.js

import { connectDB } from './config/db.js';
import app from './app.js';

// PORT değişkeni .env dosyasından app.js içinde zaten okunmuş olmalı.
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Sunucu ➜ http://localhost:${PORT}`);
      console.log(`Çalışma Modu: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Sunucu başlatılırken bir hata oluştu:', error);
    process.exit(1); // Hata durumunda uygulamayı sonlandır
  }
};

startServer();