import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Kategori adı zorunludur.'],
      unique: true, // Her kategori adı benzersiz olmalı
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Kategori açıklaması 500 karakterden uzun olamaz.'],
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;