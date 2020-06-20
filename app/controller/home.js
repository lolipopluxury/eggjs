'use strict';

const Controller = require('egg').Controller;

/**
 *  @Controller index
 */

class HomeController extends Controller {
  /**
   * @summary Function_Test
   * @description test
   * @router get /
   * @apikey Authorization
   */
  async index() {
    const { ctx } = this;
    // console.log(ctx.state.user)
    ctx.body = 'hi, egg';
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
    const result = await this.service.user.encryption(code).then(
      function(res) {
        ctx.body = res;
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
    const result = await this.service.user.decryption(code).then(
      function(res) {
        ctx.body = res;
      }
    )
  } 
}

module.exports = HomeController;
