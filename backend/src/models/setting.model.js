var mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema(
  {
    entities: { type: Object, required: true },
    ids: { type: [String], required: true },
    uid: { type: String, required: true },
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

const Setting = mongoose.model("Setting", SettingSchema);

module.exports = Setting;
