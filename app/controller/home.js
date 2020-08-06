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
    // const para = this.ctx.request.body    
    // await this.app.redis.set(para.phone,"captcha:123") 
    // this.ctx.status = 200
    // this.ctx.body = "ok"   
    const code = await this.ctx.service.captcha.generate()
    this.ctx.status = 200
    this.ctx.body = code
  }  

  /**
   * @summary redis
   * @description get redis
   * @router post /redis
   * @request formData string *phone
   * @request formData string *_csrf
   */
 
  async redis() {
    const para = this.ctx.request.body
    const that = this
    const redis = await this.app.redis.get(para.phone).then(
      function(res){
        if(res){
          that.ctx.body = res
        }else{
          that.ctx.body = "no"
        }  
      }
    )
    // if(redis === "nil"){
    //   // this.ctx.status = 204
    //   this.ctx.body = "no" 
    // }else {
    //   this.ctx.status = 200
    //   this.ctx.body = redis   
    // }
    
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
