# Çarşı - Modern E-Commerce Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)
![Vite](https://img.shields.io/badge/vite-4.x-purple.svg)


> English version below ⬇️
![Uygulama Görseli](https://raw.githubusercontent.com/NuhDemir/carsi/main/carsi.png)


---
Demo Website : https://carsi.onrender.com/
## 🇹🇷 Proje Hakkında

**Çarşı**, geleneksel Türk pazarlarının toplulukçu ruhundan esinlenen, modern ve hızlı bir e-ticaret platformudur. MERN (MongoDB, Express, React, Node.js) mimarisi ile geliştirilmiş, kullanıcı dostu ve duyarlı bir yapıya sahiptir.

### 🚀 Özellikler

- ⚡ Hızlı SPA deneyimi (Vite + React + Router)
- 💅 Responsive ve erişilebilir arayüz (Chakra UI)
- 🛒 Ürünler için tam CRUD desteği
- 🗂️ Dinamik kategoriler
- 🔍 Gerçek zamanlı arama & filtreleme
- 🌙 Işık & karanlık mod
- 📦 State yönetimi (Context API + Reducer)
- 🧱 Üretime hazır backend (statik frontend servisi)

### 🧰 Kullanılan Teknolojiler

**Frontend:**
- React
- Vite
- Chakra UI
- React Router
- Framer Motion

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS
- dotenv

---

## ⚙️ Kurulum

### Gereksinimler
- Node.js (18+)
- npm
- MongoDB (lokal ya da Atlas)

### Kurulum Adımları

```bash
git clone https://github.com/kullanici-adiniz/carsi.git
cd carsi
```

`.env` dosyası oluşturun ve şunları ekleyin:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

#### Bağımlılıkları Yükleme

```bash
npm install
npm install --prefix frontend
```

---

### Geliştirme Modu

İki terminalde:

**Backend:**
```bash
npm run dev
# http://localhost:5000
```

**Frontend:**
```bash
npm run dev --prefix frontend
# http://localhost:5173
```

---

### Üretim Modu

**Build:**
```bash
npm run build
```

**Sunucu Başlatma:**
```bash
npm start
# http://localhost:5000 üzerinden erişim
```

---

## 🇬🇧 About The Project

**Çarşı** is a modern e-commerce platform inspired by traditional Turkish bazaars. It’s a full-stack MERN application built for speed, responsiveness, and ease of use.

### 🚀 Features

- ⚡ Fast SPA (Vite + React + Router)
- 💅 Responsive UI (Chakra UI)
- 🛒 Full CRUD for products
- 🗂️ Dynamic categories
- 🔍 Real-time search & filtering
- 🌙 Light & dark theme toggle
- 📦 State management with Context API + Reducer
- 🧱 Production-ready backend (serves frontend)

### 🧰 Tech Stack

**Frontend:**
- React
- Vite
- Chakra UI
- React Router
- Framer Motion

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS
- dotenv

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (18+)
- npm
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/your-username/carsi.git
cd carsi
```

Create a `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Install dependencies:

```bash
npm install
npm install --prefix frontend
```

---

### Development Mode

**Backend:**
```bash
npm run dev
# Runs on http://localhost:5000
```

**Frontend:**
```bash
npm run dev --prefix frontend
# Runs on http://localhost:5173
```

---

### Production Mode

**Build frontend:**
```bash
npm run build
```

**Start server:**
```bash
npm start
# Access on http://localhost:5000
```

---

## 📄 License

This project is licensed under the MIT License.
