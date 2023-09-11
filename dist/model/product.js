"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "please provide product name"],
        trim: true,
    },
    category: {
        type: String,
        required: [true, "please provide product category"],
    },
    description: {
        type: String,
    },
}, { timestamps: true });
// Hash the password before saving
// Create and export the model
exports.default = mongoose_1.default.model('Product', ProductSchema);
