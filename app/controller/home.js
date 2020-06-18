'use strict';

const Controller = require('egg').Controller;

/**
 *  @Controller index
 */


class HomeController extends Controller {
  /**
   * @summary index
   * @description test
   * @router get /
   * @apikey Authorization
   */
  async index() {
    const { ctx } = this;
    // console.log(ctx.state.user)
    ctx.body = 'hi, egg';
  }  
}

module.exports = HomeController;
