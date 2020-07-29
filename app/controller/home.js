'use strict';

const Controller = require('egg').Controller;

/**
 *  @Controller index
 */

// * @apikey Authorization
class HomeController extends Controller {
  /**
   * @summary Function_Test
   * @description test
   * @router post /
   * @request formData string *role
   * @request formData string *_csrf
   */
 
  async index() {     
    const para = this.ctx.request.body  
    const role = para.role  
    // console.log(this.setrole(role));
    const isRoles = this.config.roles.some(function(value, index, array){
      return value === role
    })
    console.log(isRoles);    
    this.ctx.body = this.setrole(role)
    this.ctx.status = 200
    
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
