// backend/src/app.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

// Komut kök dizinden çalıştırıldığı için, dotenv yolu otomatik olarak bulur.
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  // Frontend build klasörünün yolunu doğru bir şekilde oluştur
  const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
  
  // Statik dosyaları sun
  app.use(express.static(frontendDistPath));

  // Diğer tüm istekleri index.html'e yönlendir
  app.get('*', (req, res) =>
    res.sendFile(path.join(frontendDistPath, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API geliştirme modunda çalışıyor...');
  });
}

app.use(errorHandler);

export default app;