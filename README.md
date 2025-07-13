Çarşı - Modern E-Commerce Platform

![alt text](https://img.shields.io/badge/license-MIT-blue.svg)


![alt text](https://img.shields.io/badge/node-20.x-green.svg)


![alt text](https://img.shields.io/badge/react-18.x-blue.svg)


![alt text](https://img.shields.io/badge/vite-4.x-purple.svg)

English | Türkçe

🇬🇧 English
About The Project

Çarşı (Turkish for "Bazaar") is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application. It's designed to be a modern, fast, and user-friendly platform for listing and exploring products, inspired by the vibrant and communal spirit of traditional Turkish bazaars.

The frontend is built with React and Vite for a blazing-fast development experience, and styled with Chakra UI for a clean, accessible, and responsive design. The backend is powered by Node.js and Express, with a MongoDB database for data persistence.

Features

⚡️ Fast & Modern Frontend: Built with Vite, React, and React Router for a smooth single-page application (SPA) experience.

💅 Beautiful & Responsive UI: Styled with Chakra UI, providing a consistent and accessible design that works on all devices.

📦 State Management: Centralized application state management using React's Context API and Reducer hooks.

🛒 Full CRUD Functionality: Create, Read, Update, and Delete operations for products.

🗂️ Dynamic Categories: Products are organized by categories, which are dynamically fetched from the backend.

🔍 Advanced Search & Filtering: Real-time product search and filtering by category.

🌙 Light & Dark Mode: Built-in theme switching for a better user experience.

🚀 Production-Ready Backend: The Express server is configured to serve the static frontend files in production, making deployment straightforward.

Built With

Frontend:

React

Vite

React Router

Chakra UI

Framer Motion

Backend:

Node.js

Express.js

MongoDB

Mongoose

CORS

dotenv

Getting Started

To get a local copy up and running, follow these simple steps.

Prerequisites

Node.js (v18 or higher recommended)

npm

MongoDB (You can use a local instance or a free cloud database from MongoDB Atlas)

Installation & Setup

Clone the repository:


git clone https://github.com/your-username/carsi.git
cd carsi


Create a .env file in the root directory of the project and add your environment variables:

Generated env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
Env


Install backend dependencies:


npm install


Install frontend dependencies:


npm install --prefix frontend


This command tells npm to run install inside the frontend directory.

Usage
Development Mode

To run both the frontend and backend servers concurrently in development mode:

Start the backend server (from the root directory):

This will run on http://localhost:5000.


npm run dev


Start the frontend development server (in a new terminal, from the root directory):

This will run on http://localhost:5173.


npm run dev --prefix frontend


Now you can access the application at http://localhost:5173.

Production Mode

To build the frontend application and serve it from the backend server:

Build the React application:

This command will install all dependencies and create an optimized production build in the frontend/dist folder.


npm run build


Start the production server:

This will start the backend server, which will also serve the frontend files.


npm start


Now you can access the production-ready application at http://localhost:5000.

<br>

🇹🇷 Türkçe
Proje Hakkında

Çarşı, adını geleneksel Türk pazarlarının canlı ve toplulukçu ruhundan alan, modern bir e-ticaret platformudur. Full-stack MERN (MongoDB, Express, React, Node.js) mimarisiyle geliştirilmiştir.

Frontend, son derece hızlı bir geliştirme deneyimi için React ve Vite ile oluşturulmuş, temiz, erişilebilir ve duyarlı bir tasarım için Chakra UI ile stillendirilmiştir. Backend ise Node.js ve Express tarafından desteklenmekte, veri kalıcılığı için MongoDB veritabanı kullanılmaktadır.

Özellikler

⚡️ Hızlı ve Modern Frontend: Akıcı bir tek sayfa uygulaması (SPA) deneyimi için Vite, React ve React Router ile geliştirildi.

💅 Şık ve Duyarlı Arayüz: Tüm cihazlarda çalışan tutarlı ve erişilebilir bir tasarım sağlayan Chakra UI ile stillendirildi.

📦 State Yönetimi: React'in Context API ve Reducer hook'ları kullanılarak merkezi bir state yönetimi sağlandı.

🛒 Tam CRUD İşlevselliği: Ürünler için oluşturma, okuma, güncelleme ve silme (CRUD) operasyonları.

🗂️ Dinamik Kategoriler: Ürünler, backend'den dinamik olarak çekilen kategorilere göre organize edilir.

🔍 Gelişmiş Arama ve Filtreleme: Gerçek zamanlı ürün arama ve kategoriye göre filtreleme.

🌙 Aydınlık ve Karanlık Mod: Daha iyi bir kullanıcı deneyimi için dahili tema değiştirme özelliği.

🚀 Üretime Hazır Backend: Express sunucusu, üretim ortamında statik frontend dosyalarını sunacak şekilde yapılandırılmıştır, bu da dağıtımı kolaylaştırır.

Kullanılan Teknolojiler

Frontend:

React

Vite

React Router

Chakra UI

Framer Motion

Backend:

Node.js

Express.js

MongoDB

Mongoose

CORS

dotenv

Başlangıç

Projeyi yerel makinenizde kurup çalıştırmak için bu basit adımları izleyin.

Ön Gereksinimler

Node.js (v18 veya üstü önerilir)

npm

MongoDB (Yerel bir kurulum veya MongoDB Atlas üzerinden ücretsiz bir bulut veritabanı kullanabilirsiniz)

Kurulum

Projeyi klonlayın:


git clone https://github.com/kullanici-adiniz/carsi.git
cd carsi


Projenin kök dizininde bir .env dosyası oluşturun ve ortam değişkenlerinizi ekleyin:

Generated env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb_baglanti_adresiniz

Env


Backend bağımlılıklarını yükleyin:


npm install


Frontend bağımlılıklarını yükleyin:


npm install --prefix frontend



Bu komut, npm'e install işlemini frontend klasörü içinde çalıştırmasını söyler.

Kullanım
Geliştirme Modu

Hem frontend hem de backend sunucularını geliştirme modunda eş zamanlı olarak çalıştırmak için:

Backend sunucusunu başlatın (kök dizinden):

Sunucu http://localhost:5000 adresinde çalışacaktır.


npm run dev


Frontend geliştirme sunucusunu başlatın (yeni bir terminalde, kök dizinden):

Sunucu http://localhost:5173 adresinde çalışacaktır.


npm run dev --prefix frontend

Artık uygulamaya http://localhost:5173 adresinden erişebilirsiniz.

Üretim Modu

Frontend uygulamasını build edip backend sunucusu üzerinden sunmak için:

React uygulamasını build edin:

Bu komut, tüm bağımlılıkları yükleyecek ve frontend/dist klasöründe optimize edilmiş bir üretim çıktısı oluşturacaktır.

npm run build

Üretim sunucusunu başlatın:

Bu komut, frontend dosyalarını da sunacak olan backend sunucusunu başlatır.


npm start

Artık üretime hazır uygulamaya http://localhost:5000 adresinden erişebilirsiniz.