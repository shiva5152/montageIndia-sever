"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const AdminsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        maxlength: [30, "name ca'nt exceed 4 character"],
        minlength: [4, "name should have more then 4 character"],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // validate: [validator.isEmail, "please enter a valid email"],
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "password should have minimum 6 character"],
        select: false,
    },
    role: {
        type: String,
        enum: ['superAdmin', 'admin', 'vendor'],
        default: 'vendor',
    },
    category: {
        type: String,
        required: true,
        default: "music"
    },
});
// hashing the password
AdminsSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
// create jwt token
AdminsSchema.methods.createJWT = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment.");
    }
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};
// compare password
AdminsSchema.methods.comparePassword = async function (givenPassword) {
    const isMatch = await bcryptjs_1.default.compare(givenPassword, this.password);
    return isMatch;
};
exports.default = mongoose_1.default.model('Admins', AdminsSchema);
