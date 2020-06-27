'use strict';

const Service = require('egg').Service;
const userSetting = require('../model/userSetting')

class UserSettingService extends Service { 

  async update(email,avatar,details){
    const result = await this.ctx.model.UserSetting.findOneAndUpdate(
      {"email":email},{"avatar":avatar,"details":details}
    ).then(
      this.ctx.status = 201,
      this.ctx.body = {msg:'modified'}
    ).catch(
      this.ctx.status = 401,
      this.ctx.body = {msg:'error'}
    )
  }
}

module.exports = UserSettingService;