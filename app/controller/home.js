'use strict';

const Controller = require('egg').Controller;
const validator = require('validator');

/**
 *  @Controller index
 */

// * @apikey Authorization
class HomeController extends Controller {
  /**
   * @summary Function_Test
   * @description test
   * @router get /
   
   */
 
  async index() {     
    this.app.redis.set('user',123) 
    this.ctx.status = 200
    this.ctx.body = "ok"   
  }  
  /**
   * @summary Encryption
   * @description test
   * @router post /encryption
   * @request formData string *code
   * @request formData string *_csrf
   */
  async encryption() {
    const { ctx } = this;
    const para = ctx.request.body
    const code = para.code
    const result = await this.service.encryption.encryption(code).then(
      function(res) {
        ctx.body = res;
        ctx.status = 200
      }
    )
  } 
  /**
   * @summary Decryption
   * @description test
   * @router post /decryption
   * @request formData string *code
   * @request formData string *_csrf
   */
  async decryption() {
    const { ctx } = this;
    const para = ctx.request.body
    const code = para.code
    const result = await this.service.encryption.decryption(code).then(
      function(res) {  
        ctx.body = res;
        ctx.status = 200
      }
    )
  } 
}

module.exports = HomeController;
