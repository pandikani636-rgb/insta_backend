import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    userIdentifier: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
