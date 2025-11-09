import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    const extracted = errors
      .array()
      .map((err) => ({ field: err.param, msg: err.msg }));
    return res.json({ success: false, errors: extracted });
  }
  next();
};
