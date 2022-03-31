var mongoose = require("mongoose");

const OptionsSchema = new mongoose.Schema(
  {
    price: Number,
    text: { type: String, required: true },
  },
  {
    _id: false,
  }
);
const ExtrasSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    options: [OptionsSchema],
  },
  {
    _id: false,
  }
);

const MealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    photoURL: String,
    extras: [ExtrasSchema],
    uid: { type: Number, required: true },
  },
  {
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

const Meal = mongoose.model("Meal", MealSchema);

module.exports = Meal;
