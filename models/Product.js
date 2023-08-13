import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: { type: Object },
  },
  {
    timestamps: true,
  },
);

export const Product = models.Product || model("Product", ProductSchema);
// 每一種 model 只要做出一個就好，記得要做出檢查是否已存在的邏輯，不然會覆寫
