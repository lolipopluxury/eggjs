'use strict';

const Service = require('egg').Service;
const userSetting = require('../model/userSetting')

class UserSettingService extends Service { 

  async update(email,avatar,details){
    const result = await this.ctx.model.UserSetting.findOneAndUpdate(
      {"email":email},{"avatar":avatar,"details":details}
    )  
    return result  
  }
}

module.exports = UserSettingService;