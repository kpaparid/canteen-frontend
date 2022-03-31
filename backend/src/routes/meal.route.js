var express = require("express");
var router = express.Router();

var MealController = require("../controllers/meal.controller");

router.get("/", MealController.getMeals);
router.post("/", MealController.createMeal);
router.delete("/:id", MealController.deleteMeal);
router.put("/:id", MealController.updateMeal);

module.exports = router;
