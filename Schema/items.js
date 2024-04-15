const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemCategory: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemCost: {
        type: Number,
        required: true,
    },
    itemImage: {
        type: Buffer, // Store image URL or filename
        required: true,
    },
    categoryImage: {
        type: Buffer, // Store image URL or filename
        required: true,
    },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
