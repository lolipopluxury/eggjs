'use strict';

const Controller = require('egg').Controller;

/**
 *  @Controller User_Management
 */

class UserSettingController extends Controller {
   /**
   * @summary setting
   * @description login with email
   * @router post /setting
   * @request formData string *data   
   * @request formData string *_csrf     
   */ 
  async update(){  
    const para = this.ctx.request.body    
    const details = JSON.parse(para.data)   
    const res = await this.service.userSetting.update(details.email,details.avatar,details.details).then(     
      (res) => {              
        this.ctx.status = 200
        this.ctx.body = {msg:"update successfully"}
      }).catch((err) => {      
        this.ctx.status = 400
        this.ctx.body = {msg:err}
    })
  }
}

module.exports = UserSettingController;