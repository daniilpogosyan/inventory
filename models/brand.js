const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  }
});

BrandSchema.virtual('url').get(function() {
  return `/catalog/brand/${this._id}`
});

module.exports = mongoose.model('Brand', BrandSchema);