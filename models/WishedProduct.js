import { Schema, model, models } from "mongoose";
import { Product } from "./Product";

const WishedProductSchema = new Schema({
  userEmail: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: Product },
});

// 在 userEmail 上建立索引
WishedProductSchema.index({ userEmail: 1 });

export const WishedProduct =
  models?.WishedProduct || model("WishedProduct", WishedProductSchema);
