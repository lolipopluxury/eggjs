'use strict';

const user = require('../model/user');
const userSetting = require('../model/userSetting')
const Service = require('egg').Service;
class UserService extends Service {
  async findUser(phonenumber){
    const result = await this.ctx.model.User.find({"phonenumber":phonenumber});
    return result
  }

  async addUser(phonenumber,role) {
    const password = this.config.inital_password
    const res = await this.findUser(phonenumber)
    const that = this
    if(res.length === 0){      
      const encode = this.service.encryption.encryption(password).then(
        function(res){
          const user = new that.ctx.model.User({
            phonenumber:phonenumber,            
            password:res,
            role:role
          })
          user.save()
          const userSetting = new that.ctx.model.UserSetting({
            phonenumber:phonenumber,
            avatar: 'default',
            details:'default details'
          })
          userSetting.save()          
        }        
      ).catch()
      return true 
    }
    else{
      return false    
    }
  } 

  //**************************************************** */
  //add user by account and password */
  // async addUser(phonenumber,username,password,role) {    
  //   const res = await this.findUser(phonenumber)
  //   const that = this
  //   if(res.length === 0){      
  //     const encode = this.service.encryption.encryption(password).then(
  //       function(res){
  //         const user = new that.ctx.model.User({
  //           phonenumber:phonenumber,
  //           username:username,
  //           password:res,
  //           role:role
  //         })
  //         user.save()
  //         const userSetting = new that.ctx.model.UserSetting({
  //           phonenumber:phonenumber,
  //           avatar: 'default',
  //           details:'default details'
  //         })
  //         userSetting.save()          
  //       }        
  //     ).catch()
  //     return true 
  //   }
  //   else{
  //     return false    
  //   }
  // } 
  //************************************************************** */
}

module.exports = UserService;