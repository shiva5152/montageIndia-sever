import { Request, Response, NextFunction } from 'express';
// import catchAsyncError from './middleware/catchAsyncError';
import catchAsyncError from '../../middleware/catchAsyncError.js';
import ErrorHandler from '../../utils/errorHandler.js';
import sendToken from '../../utils/sendToken.js';
import { AdminDocument } from '../../types/user.js';
import Admin from '../../model/user/Admin.js';
import { auth } from '../../config/firebase.js';

export const signupAdmin = catchAsyncError(async (req, res, next) => {
    // console.log(req.body);
    if (!req.body || !req.body.email) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    console.log("called ,sign")
    const { email } = req.body;
    const resi = auth.createUser({
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

    })
    // console.log(req.body);

    // if (!name || !email) {
    //     return next(new ErrorHandler("please provide all values", 400))
    // }
    const userAlreadyExists = await Admin.findOne({ email });
    if (userAlreadyExists) {
        return next(new ErrorHandler("Email already in exist", 400))
    }
    console.log("called ,sign")
    const user: AdminDocument = await Admin.create(req.body)

    res.status(201).json({
        success: true,
        message: "Admin Created successfully",
        user
    })

})

export const loginAdmin = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user: AdminDocument = await Admin.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid  Email or Password", 401))
    }
    const verifyPassword = await user.comparePassword(password);

    if (!verifyPassword) {
        return next(new ErrorHandler("Invalid  Email or Password", 401))
    }

    sendToken(user, 200, res);
})


export const logoutAdmin = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).status(200).json({
        success: true,
        message: "Logged Out Successfully"
    });


})

export const getCurrentAdmin = catchAsyncError(
    async (req, res, next) => {
        const { _id } = req.body
        const user = await Admin.findOne({ _id });
        res.status(200).json({
            success: true,
            message: "got current user Successfully",
            user
        });
    }
)

export const deleteAdmin = catchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    const user = await Admin.findOne({ _id: id });

    if (!user) {
        next(new ErrorHandler("user does not exit", 404));
    }
    await user?.deleteOne({ _id: id });
    const users = await Admin.find();
    res.status(200).json({
        success: true,
        message: "Account deleted successfully",
        users
    })

})


export const updateAdminRole = catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body is not defined", 400))
    }
    const { id, role } = req.body;
    console.log(req.body);

    const user = await Admin.findOne({ _id: id })
    if (user) {
        user.role = role;
        await user.save();

    }

    const users = await Admin.find();
    res.status(200).json({
        success: true,
        message: "user role updated successfully",
        users
    })

})
export const updateAdminCategory = catchAsyncError(async (req, res, next) => {

    if (!req.body) {
        return next(new ErrorHandler("body is not defined", 400))
    }
    const { id, category } = req.body;
    console.log(req.body);

    const user = await Admin.findOne({ _id: id })
    if (user) {
        user.category = category;
        await user.save();

    }

    const users = await Admin.find();
    res.status(200).json({
        success: true,
        message: "user category updated successfully",
        users
    })

})

export const getAllAdmin = catchAsyncError(async (req, res, next) => {

    const users = await Admin.find();

    res.status(200).json({
        success: true,
        users
    })
})
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
