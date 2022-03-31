var mongoose = require("mongoose");

const ExtrasSchema = new mongoose.Schema(
  {
    price: Number,
    text: { type: String, required: true },
  },
  {
    _id: false,
  }
);
const ItemsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    count: { type: String, required: true },
    price: { type: Number, required: true },
    comment: { type: String },
    itemId: { type: String, required: true },
    calculatedPrice: { type: String, required: true },
    extras: [ExtrasSchema],
  },
  {
    _id: false,
  }
);
const OrdersSchema = new mongoose.Schema(
  {
    items: { type: [ItemsSchema], required: true },
    status: { type: String, required: true, default: "pending" },
    user: { type: Object, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Order = mongoose.model("Order", OrdersSchema);

module.exports = Order;
