import mongoose, { Schema, model, models } from "mongoose";

const SettingSchema = new Schema(
  {
    name: { type: String, require: true, unique: true },
    value: { type: Object },
  },
  { timestamps: true },
);

export const Setting = models?.Setting || model("Setting", SettingSchema);
