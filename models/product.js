const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    img: {type: String, required: true},
    price: {type: Number, required: true, min: 0 },
    qty: {type: Number, required: true, min: 0 }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;