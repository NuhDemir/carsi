# Çarşı - Modern E-Commerce Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)
![Vite](https://img.shields.io/badge/vite-4.x-purple.svg)

> English version below ⬇️

## 🇹🇷 Proje Hakkında

**Çarşı**, geleneksel Türk pazarlarının canlı ve toplulukçu ruhundan ilham alan modern bir e-ticaret platformudur. MERN (MongoDB, Express, React, Node.js) mimarisiyle geliştirilen bu uygulama, hızlı, kullanıcı dostu ve tamamen responsif bir deneyim sunar.

### 🔑 Özellikler

- ⚡ **Hızlı Frontend:** React + Vite + React Router
- 💅 **Responsive UI:** Chakra UI ile modern tasarım
- 📦 **State Yönetimi:** Context API + useReducer
- 🛒 **Tam CRUD İşlevselliği:** Ürün yönetimi
- 🗂️ **Dinamik Kategoriler:** Backend’den çekilir
- 🔍 **Gelişmiş Arama & Filtreleme**
- 🌙 **Tema Desteği:** Light/Dark mode
- 🚀 **Üretime Hazır Backend:** Statik dosya servis desteği

### 🛠️ Kullanılan Teknolojiler

**Frontend:**

- React
- Vite
- Chakra UI
- React Router
- Framer Motion

**Backend:**

- Node.js
- Express.js
- MongoDB & Mongoose
- CORS
- dotenv

---

## ⚙️ Kurulum ve Başlatma

### 🔧 Gereksinimler

- Node.js (v18+)
- npm
- MongoDB (lokal veya MongoDB Atlas)

### 🚀 Kurulum

```bash
git clone https://github.com/kullanici-adiniz/carsi.git
cd carsi
.env dosyasını oluşturun ve aşağıdaki değişkenleri ekleyin:

env
Kopyala
Düzenle
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
Backend Bağımlılıkları:
bash
Kopyala
Düzenle
npm install
Frontend Bağımlılıkları:
bash
Kopyala
Düzenle
npm install --prefix frontend
🔄 Geliştirme Modu
İki terminal açarak aşağıdaki komutları çalıştırabilirsiniz:

1. Backend:

bash
Kopyala
Düzenle
npm run dev
# http://localhost:5000
2. Frontend:

bash
Kopyala
Düzenle
npm run dev --prefix frontend
# http://localhost:5173
🏁 Üretim Modu
Frontend Build:

bash
Kopyala
Düzenle
npm run build
Sunucuyu Başlatma:

bash
Kopyala
Düzenle
npm start
# http://localhost:5000 üzerinden frontend ve backend servis edilir.
🇬🇧 About The Project
Çarşı is a modern, full-stack MERN e-commerce platform inspired by the vibrant spirit of traditional Turkish bazaars. It delivers a fast and seamless shopping experience using today’s top web technologies.

🔑 Features
⚡ Fast Frontend: Vite + React + React Router

💅 Responsive UI: Styled with Chakra UI

📦 State Management: Context API + useReducer

🛒 Full CRUD Support: Product operations

🗂️ Dynamic Categories: Fetched from backend

🔍 Search & Filtering: Real-time interaction

🌙 Light/Dark Mode

🚀 Production-Ready: Backend serves frontend static files

🛠️ Built With
Frontend:

React

Vite

Chakra UI

React Router

Framer Motion

Backend:

Node.js

Express.js

MongoDB & Mongoose

CORS

dotenv

⚙️ Installation
Requirements
Node.js (v18+)

npm

MongoDB (local or Atlas)

Clone & Setup
bash
Kopyala
Düzenle
git clone https://github.com/your-username/carsi.git
cd carsi
Create a .env file:

env
Kopyala
Düzenle
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
Install dependencies:

bash
Kopyala
Düzenle
npm install
npm install --prefix frontend
Development
Backend:

bash
Kopyala
Düzenle
npm run dev
# Runs on http://localhost:5000
Frontend:

bash
Kopyala
Düzenle
npm run dev --prefix frontend
# Runs on http://localhost:5173
Production
Build frontend:

bash
Kopyala
Düzenle
npm run build
Start production server:

bash
Kopyala
Düzenle
npm start
# Accessible on http://localhost:5000
📄 License
Distributed under the MIT License.
