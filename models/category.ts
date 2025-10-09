import { timeStamp } from "console";
import mongoose from "mongoose";



const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        //unique: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    // description: {
    //     type: String,
    //     required: true
    // },
    // image: {
    //     type: String,
    //     required: true
    // },
    // products: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Product'
    // }]
},
{timestamps: true}
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);