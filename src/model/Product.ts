import mongoose, { Document, Model, Schema } from "mongoose";
const ProductSchema = new mongoose.Schema({
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
},
    { timestamps: true }
);

interface ProductDocument extends Document {
    name: string;
    category: string;
    description: string;
}
// Define model interface
interface AdminModel extends Model<ProductDocument> { }

// Hash the password before saving


// Create and export the model
export default mongoose.model<ProductDocument, AdminModel>('Product', ProductSchema);
