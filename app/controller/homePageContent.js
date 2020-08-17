'use strict';

const Controller = require('egg').Controller;

class HomePageContentController extends Controller {
  async setContent(){
    const { ctx } = this;
    ctx.body = '';
  }
}

module.exports = HomePageContentController;