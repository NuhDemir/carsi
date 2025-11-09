import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  body("name").isString().withMessage("name gerekli"),
  body("email").isEmail().withMessage("geçerli email gerekli"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("parola en az 6 karakter olmalı"),
  validateRequest,
  register
);

router.post(
  "/login",
  body("email").isEmail().withMessage("geçerli email gerekli"),
  body("password").exists().withMessage("parola gerekli"),
  validateRequest,
  login
);

// Me endpoints
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

export default router;
