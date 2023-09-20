"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAdmin = exports.updateAdminCategory = exports.updateAdminRole = exports.deleteAdmin = exports.getCurrentAdmin = exports.logoutAdmin = exports.loginAdmin = exports.signupAdmin = void 0;
// import catchAsyncError from './middleware/catchAsyncError';
const catchAsyncError_js_1 = __importDefault(require("../../middleware/catchAsyncError.js"));
const errorHandler_js_1 = __importDefault(require("../../utils/errorHandler.js"));
const sendToken_js_1 = __importDefault(require("../../utils/sendToken.js"));
const Admin_js_1 = __importDefault(require("../../model/user/Admin.js"));
const firebase_js_1 = require("../../config/firebase.js");
exports.signupAdmin = (0, catchAsyncError_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    if (!req.body || !req.body.email) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    console.log("called ,sign");
    const { email } = req.body;
    const resi = firebase_js_1.auth.createUser({
        email: email,
        emailVerified: false,
        password: '123shiva',
        displayName: 'John Doe',
        disabled: false
    })
        .then((userRecord) => {
        console.log('Successfully created new user:', userRecord.uid);
    })
        .catch((error) => {
        console.log('Error creating new user:', error);
    });
    return res.status(201).json({
        resi,
        success: true,
        message: "Admin Created successfully",
    });
    // console.log(req.body);
    // if (!name || !email) {
    //     return next(new ErrorHandler("please provide all values", 400))
    // }
    const userAlreadyExists = yield Admin_js_1.default.findOne({ email });
    if (userAlreadyExists) {
        return next(new errorHandler_js_1.default("Email already in exist", 400));
    }
    console.log("called ,sign");
    const user = yield Admin_js_1.default.create(req.body);
    res.status(201).json({
        success: true,
        message: "Admin Created successfully",
        user
    });
}));
exports.loginAdmin = (0, catchAsyncError_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errorHandler_js_1.default("Please Enter Email & Password", 400));
    }
    const user = yield Admin_js_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new errorHandler_js_1.default("Invalid  Email or Password", 401));
    }
    const verifyPassword = yield user.comparePassword(password);
    if (!verifyPassword) {
        return next(new errorHandler_js_1.default("Invalid  Email or Password", 401));
    }
    (0, sendToken_js_1.default)(user, 200, res);
}));
exports.logoutAdmin = (0, catchAsyncError_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).status(200).json({
        success: true,
        message: "Logged Out Successfully"
    });
}));
exports.getCurrentAdmin = (0, catchAsyncError_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    const user = yield Admin_js_1.default.findOne({ _id });
    res.status(200).json({
        success: true,
        message: "got current user Successfully",
        user
    });
}));
exports.deleteAdmin = (0, catchAsyncError_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield Admin_js_1.default.findOne({ _id: id });
    if (!user) {
        next(new errorHandler_js_1.default("user does not exit", 404));
    }
    yield (user === null || user === void 0 ? void 0 : user.deleteOne({ _id: id }));
    const users = yield Admin_js_1.default.find();
    res.status(200).json({
        success: true,
        message: "Account deleted successfully",
        users
    });
}));
exports.updateAdminRole = (0, catchAsyncError_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        return next(new errorHandler_js_1.default("body is not defined", 400));
    }
    const { id, role } = req.body;
    console.log(req.body);
    const user = yield Admin_js_1.default.findOne({ _id: id });
    if (user) {
        user.role = role;
        yield user.save();
    }
    const users = yield Admin_js_1.default.find();
    res.status(200).json({
        success: true,
        message: "user role updated successfully",
        users
    });
}));
exports.updateAdminCategory = (0, catchAsyncError_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        return next(new errorHandler_js_1.default("body is not defined", 400));
    }
    const { id, category } = req.body;
    console.log(req.body);
    const user = yield Admin_js_1.default.findOne({ _id: id });
    if (user) {
        user.category = category;
        yield user.save();
    }
    const users = yield Admin_js_1.default.find();
    res.status(200).json({
        success: true,
        message: "user category updated successfully",
        users
    });
}));
exports.getAllAdmin = (0, catchAsyncError_js_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield Admin_js_1.default.find();
    res.status(200).json({
        success: true,
        users
    });
}));
// change password
// const ChangePassword = catchAsyncError(async (req, res, next) => {
//     const { email, newPassword, oldPassword } = req.body;
//     if (!email || !newPassword || !oldPassword) {
//         return next(new ErrorHandler("Please enter Email and passwords", 400));
//     }
//     const Admin = await Admin.findOne({ email }).select("+password");
//     if (!Admin) {
//         return next(new ErrorHandler("Admin not found with this email", 401))
//     }
//     const verifyOldPassword = await Admin.comparePassword(oldPassword);
//     if (!verifyOldPassword) {
//         return next(new ErrorHandler("Old password is wrong", 401))
//     }
//     Admin.password = newPassword;
//     await Admin.save();
//     res.status(200).json({
//         success: true,
//         Admin
//     })
// })
