'use strict';

const Controller = require('egg').Controller;

/**
 *  @Controller Csrf_Check
 */

class CsrfController extends Controller {
  /**
   * @summary register
   * @description get csrf token for post request
   * @router get /token      
   */
  //@apikey shoud be added in doc to enable the security check of this api
  async getToken(){
    const { ctx } = this;  
    const token = ctx.session.csrfToken  
    ctx.body = {msg:'token get',code:200,data:token};     
  }
}

module.exports = CsrfController;