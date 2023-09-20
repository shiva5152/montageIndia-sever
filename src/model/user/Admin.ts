import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Document, Model, Schema } from "mongoose";
import * as validator from 'validator';

import { AdminDocument } from "../../types/user.js";
import { timeStamp } from "console";
// Define the schema
const AdminsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxlength: [30, "name can't exceed 30 characters"],
    minlength: [4, "name should have more than 4 characters"],
    trim: true,
    default: "none"
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: [validator.isEmail, "please enter a valid email"],
  },
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    default: "none"
  },

  password: {
    type: String,
    minlength: [6, "password should have a minimum of 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'vendor'],
    default: 'vendor',
  },
  mediaType: {
    type: String,
    required: true,
    default: "music",
  },
  category: {
    type: String,
    default: "all"
  }
},
  { timestamps: true }
);

// Define model interface
interface AdminModel extends Model<AdminDocument> { }

// Hash the password before saving
AdminsSchema.pre<AdminDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create JWT token
AdminsSchema.methods.createJWT = function (this: AdminDocument) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment.");
  }
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};

// Compare password
AdminsSchema.methods.comparePassword = async function (this: AdminDocument, givenPassword: string) {
  const isMatch = await bcrypt.compare(givenPassword, this.password);
  return isMatch;
};

// Create and export the model
export default mongoose.model<AdminDocument, AdminModel>('Admin', AdminsSchema);
