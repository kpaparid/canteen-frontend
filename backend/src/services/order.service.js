var Order = require("../models/order.model");

exports.getOrders = async function (query, page, limit) {
  try {
    var orders = await Order.find(query);
    return orders;
  } catch (e) {
    throw Error("Error while Paginating Users");
  }
};
exports.createOrder = async function (body) {
  try {
    var orders = await Order.insertMany(body);
    return orders;
  } catch (e) {
    throw Error(e);
  }
};
exports.updateOrder = async function (id) {
  try {
    // var orders = await Meal.create(body);
    // return orders;
    return true;
  } catch (e) {
    throw Error(e);
  }
};
exports.deleteOrder = async function (id) {
  try {
    const ids = id.split(",");
    await Order.deleteMany({ _id: { $in: ids } });
    return true;
  } catch (e) {
    throw Error(e);
  }
};
