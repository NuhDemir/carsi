import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in environment");
  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Lütfen isim, email ve parola sağlayın");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Bu email ile kayıtlı kullanıcı mevcut");
  }

  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error("Kullanıcı oluşturulamadı");
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error("Geçersiz email veya parola");
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error("Kullanıcı doğrulanamadı");
  }
  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı");
  }
  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

// @desc    Update current user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401);
    throw new Error("Kullanıcı doğrulanamadı");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı");
  }

  const { name, email, password } = req.body;

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error("Bu email zaten kullanımda");
    }
    user.email = email;
  }
  if (name) user.name = name;
  if (password) user.password = password; // will be hashed by pre-save hook

  const updated = await user.save();

  res.json({
    success: true,
    data: {
      id: updated._id,
      name: updated.name,
      email: updated.email,
      isAdmin: updated.isAdmin,
      token: generateToken(updated._id),
    },
  });
});
