"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema
const AdminsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        maxlength: [30, "name can't exceed 30 characters"],
        minlength: [4, "name should have more than 4 characters"],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // validate: [validator.isEmail, "please enter a valid email"],
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
    category: {
        type: String,
        required: true,
        default: "music",
    },
}, { timestamps: true });
// Hash the password before saving
AdminsSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
// Create JWT token
AdminsSchema.methods.createJWT = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment.");
    }
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};
// Compare password
AdminsSchema.methods.comparePassword = async function (givenPassword) {
    const isMatch = await bcryptjs_1.default.compare(givenPassword, this.password);
    return isMatch;
};
// Create and export the model
exports.default = mongoose_1.default.model('Admin', AdminsSchema);
