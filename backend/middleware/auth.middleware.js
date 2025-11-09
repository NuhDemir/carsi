import jwt from 'jsonwebtoken';

// protect: JWT doğrulaması yapar ve req.user'a decoded token bilgisini ekler
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Yetkilendirme hatası: Token bulunamadı');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500);
      throw new Error('Sunucu yapılandırması hatası: JWT_SECRET tanımlı değil');
    }

    const decoded = jwt.verify(token, secret);
    // decoded içinde kullanıcı bilgileri varsa onları req.user'a ekle
    req.user = decoded;
    next();
  } catch (err) {
    // express-async-handler kullanılmadığı için hatayı kendimiz fırlatıyoruz
    next(err);
  }
};

// admin: protect ile doğrulanmış kullanıcı için isAdmin kontrolü
export const admin = (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Yetkilendirme hatası: Kullanıcı doğrulanmadı');
    }

    if (!req.user.isAdmin) {
      res.status(403);
      throw new Error('Yetki hatası: Yönetici yetkisi gerekli');
    }

    next();
  } catch (err) {
    next(err);
  }
};
