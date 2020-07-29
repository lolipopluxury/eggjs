/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1592191727762_4224';

  // add global middleware config here
  config.middleware = [];

  config.roles = ['admin','customer-service',
    'doctor','seller','distributor',
    'user','silver-vip','golden-vip','platinum-vip'];

  config.security = {
    csrf: {  
      enable:true,
      useSession: true,  
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
    }
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.mongoose = {    
    client: {      
      url: 'mongodb://localhost:27017/eggjs',
      options: {useFindAndModify: false,}
    }  
  };

  config.jwt = {
    secret: 'big feet'
  };

  config.session = {
    key: "EGG_SESSION",
    maxAge: 1 * 3600 * 1000,     
    }

  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'API Doc',  
      version: '1.0.1',
    },
    schemes: ['http', 'https'],
    consumes: ['application/x-www-form-urlencoded'],
    produces: ['application/json'],
    securityDefinitions: {
      apikey: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },      
    },
    enableSecurity: true,
    enableValidate: true,
    routerMap: false,
    enable: true,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    secret:'big feet',
    salt:'long toes',
    hashSecret:'oilsole'
  };

  return {
    ...config,
    ...userConfig,
  };
};
