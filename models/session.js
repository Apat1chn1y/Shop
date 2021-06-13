const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  _id: {type: String, required: true},
  expires: {type:Date, required: true},
  session:{
    cookie: {type: Object, required: true},
    csrfSecret: String,
    flash: Object,
    isLoggedIn: Boolean,
    user: Object,
    tg: String},
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
         },
          quantity: { type: Number, required: true }
        }
      ]
    }
  
});


sessionSchema.methods.addsToCart = function(product) {
  console.log('we are here')
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

sessionSchema.methods.removesFromsCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

sessionSchema.methods.clearsCart = function() {
  this.Booleancart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('Session', sessionSchema);