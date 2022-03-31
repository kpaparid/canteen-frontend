var SettingService = require("../services/Setting.service");

exports.getSettings = async function (req, res, next) {
  var page = req.params.page ? req.params.page : 1;
  var limit = req.params.limit ? req.params.limit : 10;
  try {
    var Settings = await SettingService.getSettings(req.query, page, limit);
    return res.status(200).json({
      status: 200,
      data: Settings,
      message: "Successfully Retrieved Settings",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.createSetting = async function (req, res, next) {
  try {
    var Settings = await SettingService.createSetting(req.body);
    return res.status(200).json({
      status: 201,
      data: Settings,
      message: "Successfully Created Setting",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
exports.updateSetting = async function (req, res, next) {
  try {
    // var Settings = await SettingService.deleteSetting(req.body);
    return res.status(200).json({
      status: 201,
      // data: Settings,
      message: "Successfully Created Setting",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
exports.deleteSetting = async function (req, res, next) {
  try {
    var Settings = await SettingService.deleteSetting(req.params.id);
    return res.status(200).json({
      status: 201,
      data: Settings,
      message: "Successfully Created Setting",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
