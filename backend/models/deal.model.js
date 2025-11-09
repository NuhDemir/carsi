import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    discountPercent: { type: Number, min: 0, max: 100, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    limitedStock: { type: Number },
  },
  { timestamps: true }
);

const Deal = mongoose.model("Deal", dealSchema);
export default Deal;
