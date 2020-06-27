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
    const { ctx } = this;
    const para = ctx.request.body    
    const details = JSON.parse(para.data)   
    const res = this.service.userSetting.update(details.email,details.avatar,details.details)

    // ctx.body = {
    //   data : 1
    // }
  }
}

module.exports = UserSettingController;