var Setting = require("../models/Setting.model");

exports.getSettings = async function (query, page, limit) {
  try {
    var Settings = await Setting.find(query);
    return Settings;
  } catch (e) {
    throw Error("Error while Paginating Users");
  }
};
exports.createSetting = async function (body) {
  try {
    const old = await Setting.findOne({ uid: body?.uid });
    const entities = {
      ...old?.entities,
      [body.entity.id]: body.entity,
    };
    const ids = Object.keys(entities);
    const Settings = Setting.findOneAndUpdate(
      { uid: body?.uid },
      { ...body, ids, entities },
      {
        upsert: true,
      }
    );
    return Settings;
  } catch (e) {
    throw Error(e);
  }
};
exports.updateSetting = async function (id) {
  try {
    // var Settings = await Setting.create(body);
    // return Settings;
    return true;
  } catch (e) {
    throw Error(e);
  }
};
exports.deleteSetting = async function (id) {
  try {
    const ids = id.split(",");
    await Setting.deleteMany({ _id: { $in: ids } });
    return true;
  } catch (e) {
    throw Error(e);
  }
};
