import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı zorunludur.'],
      trim: true, // Baştaki ve sondaki boşlukları temizler
      minlength: [3, 'Ürün adı en az 3 karakter olmalıdır.'],
    },
    description: {
      type: String,
      required: [true, 'Ürün açıklaması zorunludur.'],
      maxlength: [1000, 'Ürün açıklaması en fazla 1000 karakter olabilir.'],
    },
    price: {
      type: Number,
      required: [true, 'Fiyat zorunludur.'],
      min: [0, 'Fiyat 0\'dan küçük olamaz.'],
    },
    image: {
      type: String,
      required: [true, 'Görsel URL\'si zorunludur.'],
      // İleride buraya bir URL formatı doğrulaması eklenebilir.
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // 'Category' modeline referans veriyoruz
      required: [true, 'Kategori zorunludur.'],
    },
    stock: {
      type: Number,
      required: [true, 'Stok adedi zorunludur.'],
      min: [0, 'Stok adedi 0\'dan küçük olamaz.'],
      default: 0, // Varsayılan değer
    },
    rating: {
      type: Number,
      min: [0, 'Puan 0\'dan küçük olamaz.'],
      max: [5, 'Puan 5\'ten büyük olamaz.'],
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
    //toJSON: { virtuals: true }, // Sanal alanlar için
    //toObject: { virtuals: true }, // Sanal alanlar için
  }
);

// Fiyat veya isim değişikliğinde arama için bir index eklemek performansı artırır
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;