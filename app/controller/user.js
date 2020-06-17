'use strict';

const validator = require('validator');
const Controller = require('egg').Controller;

/**
 *  @Controller User_Management
 */

class UserController extends Controller {
    /**
   * @summary register
   * @description quick register
   * @router post /register
   * @request formData string *email  
   * @request formData string *username 
   * @request formData string *password
   * @request formData string *role
   * @request formData string *_csrf   
   */
  async register(){ 
    const para = this.ctx.request.body  
    const email = para.email
    const username = para.username
    const password = para.password
    const role = para.role  
    if(validator.isEmail(email)){
      const res = await this.service.user.addUser(email,username,password,role)
      if(res){
        this.ctx.body = {msg:`user created successfully, username: ${res.username}`,code:200}
      }
      else {
        this.ctx.body = {msg:'this user has already existed',code:200}
      }
    }else {
      this.ctx.body = {msg:'Please input a avaliable email address',code:200}
    }  
  }

  async login(){
     /**
   * @summary login
   * @description login with email
   * @router post /login
   * @request formData string *email 
   * @request formData string *password
   * @request formData string *_csrf  
   * @apikey Authorization
   */ 
    const para = this.ctx.request.body
    const findUser =  await this.service.user.findUser(para.email)
    if(findUser.length === 0) {
      this.ctx.body = {msg:"this user do not exsist",code:401}
    } else {
      if(para.password === findUser[0].password){
        const jwtToken = this.app.jwt.sign({    
          email: para.email,
          role: findUser[0].role   
         }, this.app.config.jwt.secret);
        this.ctx.body = {msg:"login successfully",code:200,token:jwtToken}
      }else {
        this.ctx.body = {msg:"password is uncorrect",code:401}
      }  
    }
  }
}

module.exports = UserController;