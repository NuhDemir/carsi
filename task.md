# Proje Geliştirme Görevleri (task.md)

Bu dosya `carsi` uygulaması için eksiksiz geliştirme planını, öncelikleri, kabul kriterlerini ve izlenecek adımları içerir. Bu doküman, yapılacak işleri takip etmek ve görevleri sıraya koymak için kullanılacaktır.

## Kısa Özet

- Proje: carsi
- Amaç: Backend ve frontend'i kararlı, testli ve üretime hazır hale getirmek.
- Kapsam: Hata düzeltmeleri, validation, UI/UX küçük iyileştirmeleri, testler, CI ve dokümantasyon.

## Varsayımlar

- Geliştirme ortamı Windows üzerinde ve Node.js kullanılacak.
- Veritabanı bağlantısı için `backend/config/db.js` kullanılıyor; gerekli environment değişkenleri `.env` veya platforma özgü ayarlarda tanımlanmalı.
- Frontend Vite ile hazırlanmış (kök: `frontend/`).

## Yüksek seviyeli adımlar

1. Repo analizi ve yerel build/çalıştırma adımlarını doğrula.
2. `backend`'te hata yönetimi, validation ve logging iyileştirmeleri yap.
3. `frontend` bileşen hatalarını düzelt, yüklenme ve hata durumlarını göster.
4. Temel unit/integration testleri ekle.
5. CI (GitHub Actions) pipeline ekle.
6. README ve deploy talimatlarını güncelle.
7. Final QA ve PR hazırlığı.

## Detaylı görevler ve kabul kriterleri

### 1) Repo analizi & build

- Hedef: Proje yerelde build/çalıştırılabilir hâle gelsin veya karşılaşılan hatalar listelensin.
- Yapılacaklar:
  - `package.json` ve `frontend/package.json` bağımlılıklarını kontrol et.
  - `backend` için `npm install` ardından `node backend/server.js` veya uygun start script denenmeli.
- Kabul kriteri: Backend ve frontend startup adımları dokümante edildi; çalıştırılamayan kısımlar için hatalar listelendi.

### 2) Backend iyileştirmeleri

- Hedef: Güvenli, anlaşılır hata yönetimi ve temel API stabilitesi.
- Yapılacaklar:
  - `backend/middleware/error.middleware.js` gözden geçirilip geliştirilmesi.
  - Eksik env değişkenleri için `.env.example` eklenmesi.
  - CORS konfigürasyonu ve basit request logging ekleme (`morgan` önerilir).
- Kabul kriteri: CRUD endpoint'ler çalışıyor ve anlamlı HTTP hata kodları dönülüyor.

### 3) Model & controller güncellemeleri

- Hedef: Doğrulama, sayfalama ve arama destekli, hatasız controller'lar.
- Yapılacaklar:
  - `backend/controllers/*.js` içine input validation (ör. `joi` veya express-validator) ekle.
  - Listeleme endpoint'lerine pagination ve arama parametreleri ekle.
- Kabul kriteri: API üzerinde page/limit parametreleri ile sorgulama yapılabiliyor.

### 4) Frontend düzeltmeleri

- Hedef: UI hatalarını düzelt, erişilebilirlik ve UX iyileştirmeleri yap.
- Yapılacaklar:
  - Bileşen dosya adlarındaki hataları düzelt (örn. `ThemeToggleButton .jsx` -> `ThemeToggleButton.jsx`).
  - `LoadingSpinner`, `ProductCard` ve sayfa bileşenlerinde yükleniyor/hata durumları ekle.
  - `Search` ve `Navbar` test et ve gerekli düzeltmeleri uygula.
- Kabul kriteri: Sayfa geçişleri düzgün, bileşenler hata/yüklenme durumlarını gösteriyor.

### 5) Formlar ve validasyon (frontend)

- Hedef: Create/Edit formlarında client-side validation.
- Yapılacaklar: `frontend/src/pages/Create.jsx`'i kontrol et ve form validasyonu ekle.
- Kabul kriteri: Geçersiz girişlerde kullanıcıya anlamlı uyarılar gösteriliyor.

### 6) Testler

- Hedef: Temel birimler ve entegrasyon testleri ile regressiyonları yakalamak.
- Yapılacaklar:
  - Backend: `jest` + `supertest` ile en az 3 endpoint testi.
  - Frontend: `vitest` + `@testing-library/react` ile 3 komponent testi.
- Kabul kriteri: Test komutları çalışıyor ve geçiyor (`npm test` veya `pnpm test`).

### 7) CI / GitHub Actions

- Hedef: PR'lerde lint, test ve build adımlarını çalıştıran pipeline.
- Yapılacaklar: `.github/workflows/ci.yml` oluştur ve temel adımları ekle.
- Kabul kriteri: PR açıldığında workflow tetikleniyor.

### 8) Dokümantasyon

- Hedef: README güncellensin, çalıştırma ve deploy adımları olsun.
- Yapılacaklar: Kök `README.md`'ye çalıştırma adımları, environment değişkenleri, test ve deploy talimatları ekle.
- Kabul kriteri: Yeni README temel adımları içeriyor ve başka bir geliştirici kolayca başlatabiliyor.

### 9) Final QA & cleanup

- Hedef: Proje PR için hazır olsun.
- Yapılacaklar: Tüm değişiklikleri test et, gereksiz console.log veya debug kodlarını temizle.
- Kabul kriteri: Tüm todo'lar tamamlandı, build ve testler geçiyor.

## Zaman Tahmini (kabaca)

- Repo analiz: 1-2 saat
- Backend düzeltmeleri: 4-8 saat (hata/eksiklere göre değişir)
- Frontend düzeltmeleri: 4-8 saat
- Testler: 3-6 saat
- CI + Dokümantasyon: 1-3 saat

## Nasıl başlayacağız (önceliklendirme)

1. Bu `task.md` dosyasını ekle (tamamlandıysa sonraki adıma geç).
2. Repo analizi: bağımlılık yükle, `npm run` veya `node` ile start deneyin; çıkan hataları kaydedin.
3. Backend kritik hatalarını düzeltin (DB bağlantısı, middleware).
4. Frontend küçük düzeltmeler ve bileşen testleri.

## İletişim / Notlar

- Ben bu planı uygulamaya hazırım. Siz onay verirseniz ilk olarak repo analizi ve çalıştırma adımlarını yapacağım ve çıkan hataları buraya raporlayacağım.

---

Güncelleme tarihi: 2025-11-09

## İlerleme (kısa)

- [x] `task.md` oluşturuldu ve plan belirlendi.
- [~] `Repo analizi & build` — şu anda in-progress (bağımlılıklar kuruldu / sunucu test ediliyor).
- [ ] `Backend iyileştirmeleri` — DB ve middleware düzeltmeleri yapılacak.
- [ ] `Frontend düzeltmeleri` — bileşen ve form iyileştirmeleri.
- [ ] `Testler` — temel unit ve integration testleri eklenecek.

## Hemen yapılacak (öncelik sırası)

1. Repo analizi sonuçlarını tamamla ve `Repo analizi & build` maddesini tamamla: hangi komutlar çalıştı, hangi hatalar alındı, hangi düzeltmeler yapıldı.
2. Backend: eksik veya hatalı env/config düzenlemelerini uygula, `connectDB` kontrolünü doğrula.
3. Frontend: derleme/çalıştırma hataları varsa düzelt, özellikle dosya adlarında boşluk veya yanlış import'ları temizle.
4. Basit testler ekle (backend: 3 endpoint, frontend: 3 komponent).

Her adımı tamamlayınca bu dosyayı veya proje issue/PR'larını güncelleyin. İsterseniz ben her tamamlanan adım için otomatik küçük bir PR hazırlayabilirim.
