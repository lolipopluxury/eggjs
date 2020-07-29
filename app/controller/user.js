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
  * @request formData string *phonenumber  
  * @request formData string *username 
  * @request formData string *password
  * @request formData string *role
  * @request formData string *_csrf   
  */
  async register(){ 
    const para = this.ctx.request.body  
    const phonenumber = para.phonenumber
    const username = para.username
    const password = para.password
    const role = para.role
    const isRoles = this.config.roles.some(function(value){
      return value === role
    })   
    if(isRoles){
      if(validator.isMobilePhone(phonenumber, ['zh-CN','en-AU'],{strictMode:true})){
        const res = await this.service.user.addUser(phonenumber,username,password,role)  
        if(res){
          this.ctx.status = 201
          this.ctx.body = {msg:`user created successfully, username: ${username}`}
        }
        else {
          this.ctx.status = 400
          this.ctx.body = {msg:'this user has already existed'}
        }
      }else {
        this.ctx.status = 400
        this.ctx.body = {msg:'Please input a avaliable phonenumber'}
      }  
    }else {
      this.ctx.status = 400
        this.ctx.body = {msg:'Please input a avaliable role'}
    }  
  }

   /**
   * @summary login
   * @description login with email
   * @router post /login
   * @request formData string *email 
   * @request formData string *password
   * @request formData string *_csrf  
   * @apikey Authorization
   */ 

  //console.log(ctx.state.user) get information in signing
  async login(){   
    const that = this
    const para = this.ctx.request.body
    const findUser =  await this.service.user.findUser(para.email)
    if(findUser.length === 0) {
      this.ctx.status = 400
      this.ctx.body = {msg:"this user do not exsist"}
    } else {
      const csrfToken = this.ctx.session.csrfToken 
      const decode = await this.service.user.decryption(findUser[0].password).then(
        function(res){          
          if(res === para.password){
            const jwtToken = that.app.jwt.sign({    
              email: para.email,
              csrfToken:csrfToken,
              role: findUser[0].role   
             }, that.app.config.jwt.secret);
             this.ctx.status = 200
             this.ctx.body = {msg:"login successfully",token:jwtToken}
          }else {
            this.ctx.status = 401
            this.ctx.body = {msg:"password is uncorrect"}
          }
        }
      ).catch()    
    }
  }

  /**
   * @summary Logout
   * @description log out
   * @router get /logout
   * @apikey Authorization
   */
  async logout(){
    const { ctx } = this
    ctx.session = null
    ctx.status = 200
    ctx.body = {msg:'log out successfully'}
  }
}

module.exports = UserController;