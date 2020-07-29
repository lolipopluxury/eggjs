'use strict';

const user = require('../model/user');
const userSetting = require('../model/userSetting')
const Service = require('egg').Service;
class UserService extends Service {
  async findUser(email){
    const result = await this.ctx.model.User.find({"email":email});
    return result
  }
  async addUser(email,username,password,role) {    
    const res = await this.findUser(email)
    const that = this
    if(res.length === 0){      
      const encode = this.service.encryption.encryption(password).then(
        function(res){
          const user = new that.ctx.model.User({
            email:email,
            username:username,
            password:res,
            role:role
          })
          user.save()
          const userSetting = new that.ctx.model.UserSetting({
            email:email,
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
}

module.exports = UserService;