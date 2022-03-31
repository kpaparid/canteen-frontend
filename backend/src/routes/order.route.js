var express = require("express");
var router = express.Router();

var OrderController = require("../controllers/order.controller");

router.get("/", OrderController.getOrders);
router.post("/", OrderController.createOrder);
router.delete("/:id", OrderController.deleteOrder);
router.put("/:id", OrderController.updateOrder);

module.exports = router;
