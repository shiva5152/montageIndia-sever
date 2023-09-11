"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (user, statusCode, res) => {
    const token = user.createJWT();
    // one day=24*60*60*1000
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        // secure: process.env.NODE_ENV === 'production',
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        user,
    });
};
