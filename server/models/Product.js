import mongoose from "mongoose";
{/**This will be the user Schema */}
const ProductSchema = new mongoose.Schema(
    {
        name: String,
        price: Number,
        description: String,
        category: String,
        rating: Number,
        supply: Number,
    }, {timestamps: true}
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;