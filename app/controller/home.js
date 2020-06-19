'use strict';

const Controller = require('egg').Controller;
const fs = require('fs')
const crypto = require('crypto')

/**
 *  @Controller index
 */


class HomeController extends Controller {
  /**
   * @summary Function_Test
   * @description test
   * @router get /
   * @apikey Authorization
   */
  async index() {
    const { ctx } = this;
    //fs.read go through in src rather than the controller's position
    const privateKey = fs.readFileSync('./rsa_private_key.pem').toString('utf-8')
    console.log(privateKey) 
    const publicKey = fs.readFileSync('./rsa_public_key.pem').toString('utf-8')
    console.log(publicKey)  

    const encodeData = crypto.publicEncrypt(publicKey, Buffer.from('lolipop')).toString('base64');
    console.log("encode: ", encodeData)
    console.log('********************')
    const decodeData = crypto.privateDecrypt(privateKey, Buffer.from(encodeData.toString('base64'), 'base64'));
    console.log("decode: ", decodeData.toString())

    // console.log(ctx.state.user)
    ctx.body = 'hi, egg';
  }  
}

module.exports = HomeController;
