const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: [{type: mongoose.Types.ObjectId, ref: 'Category'}]
  },
  brand: {
    type: mongoose.Types.ObjectId,
    ref: 'Brand'
  },
  price: {
    type: Number,
    // round the number to the hundredths
    set: v => Math.round(v * 100) / 100,
    get: v => Math.round(v * 100) / 100,
    min: 0,
    required: true
  },
  numberInStock: {
    type: Number,
    set: v => Math.floor(v),
    get: v => Math.floor(v),
    min: 0,
    required: true,
  }
});

module.exports = mongoose.model('Item', ItemSchema);