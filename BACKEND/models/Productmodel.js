const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  description: { type: String, required: true },
  images: { type: [String], required: true },
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true } // Ensure price is required
});

const virtualId = productSchema.virtual('id');
virtualId.get(function () {
  return this._id;
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

exports.Product = mongoose.model('Product', productSchema);