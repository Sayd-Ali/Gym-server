const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      ref: "User",
      type: mongoose.SchemaTypes.ObjectId,
    },
    subscription: {
      ref: "Subscription",
      type: mongoose.SchemaTypes.ObjectId,
      default: null,
    },
    trainer: {
      ref: "Trainer",
      type: mongoose.SchemaTypes.ObjectId,
      default: null,
    },
    productsCart: [
      {
        product: {
          ref: "Products",
          type: mongoose.SchemaTypes.ObjectId,
          
        },
        amount: {
          type: Number
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
