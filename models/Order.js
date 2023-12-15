import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    userEmail: String,
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: Boolean,
    userId: String,
  },
  {
    timestamps: true,
  }
);

// 在 userEmail 上建立索引
OrderSchema.index({ userEmail: 1 });

export const Order = models.Order || model("Order", OrderSchema);
