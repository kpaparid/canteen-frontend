var Meal = require("../models/meal.model");

exports.getMeals = async function (query, page, limit) {
  try {
    var meals = await Meal.find(query);
    return meals;
  } catch (e) {
    throw Error("Error while Paginating Users");
  }
};
exports.createMeal = async function (body) {
  try {
    var meals = await Meal.create(body);
    return meals;
  } catch (e) {
    throw Error(e);
  }
};
exports.updateMeal = async function (id) {
  try {
    // var meals = await Meal.create(body);
    // return meals;
    return true;
  } catch (e) {
    throw Error(e);
  }
};
exports.deleteMeal = async function (id) {
  try {
    const ids = id.split(",");
    await Meal.deleteMany({ _id: { $in: ids } });
    return true;
  } catch (e) {
    throw Error(e);
  }
};
