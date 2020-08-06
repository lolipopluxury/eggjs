'use strict';

const Service = require('egg').Service;

class CaptchaService extends Service {
  async generate(){  
    const captcha = Math.random().toString().slice(-6)  
    return captcha
  }
}

module.exports = CaptchaService;