import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";


const AdminsSchema = new mongoose.Schema({
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
})

// hashing the password
AdminsSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})
// create jwt token
AdminsSchema.methods.createJWT = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment.");
    }

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

// compare password
AdminsSchema.methods.comparePassword = async function (givenPassword: string) {
    const isMatch = await bcrypt.compare(givenPassword, this.password);
    return isMatch;
}

export default mongoose.model('Admins', AdminsSchema);
