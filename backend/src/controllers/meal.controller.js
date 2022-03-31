var MealService = require("../services/meal.service");

exports.getMeals = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var meals = await MealService.getMeals({}, page, limit);
    return res.status(200).json({
      status: 200,
      data: meals,
      message: "Successfully Retrieved Meals",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.createMeal = async function (req, res, next) {
  try {
    var meals = await MealService.createMeal(req.body);
    return res.status(200).json({
      status: 201,
      data: meals,
      message: "Successfully Created Meal",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
exports.updateMeal = async function (req, res, next) {
  try {
    // var meals = await MealService.deleteMeal(req.body);
    return res.status(200).json({
      status: 201,
      // data: meals,
      message: "Successfully Created Meal",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
exports.deleteMeal = async function (req, res, next) {
  try {
    var meals = await MealService.deleteMeal(req.params.id);
    return res.status(200).json({
      status: 201,
      data: meals,
      message: "Successfully Created Meal",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
