import { Schema, model, models } from "mongoose";

const AddressSchema = new Schema({
  userEmail: { type: String, unique: true, require: true },
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAddress: String,
  country: String,
});

export const Address = models?.Address || model("Address", AddressSchema);
