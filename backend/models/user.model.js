import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "İsim zorunludur."] },
    email: {
      type: String,
      required: [true, "Email zorunludur."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Parola zorunludur."] },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Parola setlendiğinde otomatik hashle
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// parola karşılaştırma metodu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
