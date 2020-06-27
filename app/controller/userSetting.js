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
    const data = para.data
    const dedata = JSON.parse(data)   
    ctx.body = {
      data : dedata
    }
  }
}

module.exports = UserSettingController;