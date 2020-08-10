'use strict';

const validator = require('validator');
const user = require('../model/user');
const Controller = require('egg').Controller;

/**
 *  @Controller User_Management
 */

class UserController extends Controller {
  /**
  * @summary getCaptcha
  * @description get captcha
  * @router post /getcaptcha
  * @request formData string *phonenumber  
  * @request formData string *role
  * @request formData string *_csrf   
  */
  async getCaptcha(){    
    const para = this.ctx.request.body      
    const phonenumber = para.phonenumber
    const that = this    
    if(validator.isMobilePhone(phonenumber, ['zh-CN','en-AU'],{strictMode:true})){
      await this.app.redis.get(para.phonenumber).then(
        async (res) => {
          const user_temp_ob = JSON.parse(res) 
          if(user_temp_ob == null){
            const captcha = await this.ctx.service.captcha.generate()
            const count = 1
            await this.app.redis.set(phonenumber,`{"captcha":"${captcha}","count":"${count}"}`).then(
              async (res) => {
                await that.app.redis.expire(phonenumber,120)
                that.ctx.status = 200
                that.ctx.body = {msg:'the captcha will expire in two minutes',captcha:captcha}
              }
            )
          }else {            
            const _count = Number(user_temp_ob.count) + 1
            if(_count > 2){
              that.ctx.status = 400
              that.ctx.body = {msg:'the api is limited, please try later'}              
            }else {
              await this.app.redis.set(phonenumber,`{"captcha":"${user_temp_ob.captcha}","count":"${_count}"}`).then(
                async (res) => {       
                  await that.app.redis.expire(phonenumber,60)           
                  that.ctx.status = 200
                  that.ctx.body = {msg:'the captcha will expire in one minutes',captcha:user_temp_ob.captcha}
                }
              )
            }            
          }
        }
      )      
    }else {
      this.ctx.status = 400
      this.ctx.body = {msg:'Please input a phonenumber avaliable'}
    }  
  }
  /**
  * @summary register
  * @description quick register
  * @router post /register
  * @request formData string *phonenumber  
  * @request formData string *captcha  
  * @request formData string *role
  * @request formData string *_csrf   
  */

  async register(){
    const para = this.ctx.request.body
    const that = this
    const isRoles = this.config.roles.some(
      (value) => {return value === para.role}
    )
    if(isRoles){
        await this.app.redis.get(para.phonenumber).then(
        async (res) => {
          const user_temp_ob = JSON.parse(res) 
          if(user_temp_ob == null){
            that.ctx.status = 400
            that.ctx.body = {msg:'the captcha has expired already'}
          }else {
            if(para.captcha === user_temp_ob.captcha){
              const addUser = await that.ctx.service.user.addUser(para.phonenumber,para.role)
              if(addUser){
                that.ctx.status = 201
                that.ctx.body = {msg:`user created successfully, account is: ${para.phonenumber}`}
              }
              else {
                that.ctx.status = 400
                that.ctx.body = {msg:'this user has already existed'}
              }
            }else {
              that.ctx.status = 400
              that.ctx.body = {msg:'the captcha is unavaliable'}
            }
          }          
        }
      )      
    }else {
      this.ctx.status = 400
      this.ctx.body = {msg:'Please input a role avaliable'}
    }
  }

   /**
   * @summary login
   * @description login with phonenumber
   * @router post /login
   * @request formData string *phonenumber 
   * @request formData string *password
   * @request formData string *_csrf  
   * @apikey Authorization
   */ 

  //console.log(ctx.state.user) get information in signing
  async login(){   
    const that = this
    const para = this.ctx.request.body
    const findUser =  await this.service.user.findUser(para.phonenumber)
    if(findUser.length === 0) {
      this.ctx.status = 400
      this.ctx.body = {msg:"this user do not exsist"}
    } else {
      const csrfToken = this.ctx.session.csrfToken 
      const decode = await this.service.user.decryption(findUser[0].password).then(
        (res) => {          
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