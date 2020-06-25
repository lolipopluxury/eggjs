module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSettingSchema = new Schema({
    avatar: {
      type:String,
    },
    details: {
      type:String,
    },
  });
  return mongoose.model('UserSetting',UserSettingSchema,'userSetting')
}