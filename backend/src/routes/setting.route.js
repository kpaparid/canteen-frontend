var express = require("express");
var router = express.Router();

var SettingController = require("../controllers/setting.controller");

router.get("/", SettingController.getSettings);
router.post("/", SettingController.createSetting);
router.delete("/:id", SettingController.deleteSetting);
router.put("/:id", SettingController.updateSetting);

module.exports = router;
