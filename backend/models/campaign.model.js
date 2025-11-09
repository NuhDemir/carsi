import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    ctaText: { type: String, default: "Şimdi İncele" },
    ctaUrl: { type: String, default: "/" },
    image: { type: String },
    active: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    startsAt: { type: Date },
    endsAt: { type: Date },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
