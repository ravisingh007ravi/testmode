const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productImg: {
        secure_url: { type: String, required: true, trim: true },
        public_id: { type: String, required: true, trim: true }
    },
    bardName: { type: String, required: true, trim: true },
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: ['men', 'women', 'kids', 'old'], required: true, trim: true },
    rating: { type: Number, required: false, trim: true },
    numberofRating: { type: Number, required: true, default: 5, trim: true },
    size: { type: String, enum: ['Wide', 'Narrow', 'Medium', 'ExtraWide'], required: true, trim: true },
    fashion: { type: String, enum: ['Sport', 'Fashion', 'Classic', 'Old'], required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    modelNo: { type: String, required: true, trim: true },
    isdeleted: { type: Boolean, default: false }

}, { timestamps: true });




module.exports = mongoose.model('product', productSchema);