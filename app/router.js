'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  const interceptor = app.middleware.interceptor() //isolated middleware 
  router.get('/',controller.home.index);
  router.post('/redis',controller.home.redis);
  router.get('/token',controller.csrf.getToken);
  router.get('/logout',jwt,interceptor,controller.user.logout);
  router.post('/encryption',controller.home.encryption);
  router.post('/decryption',controller.home.decryption);
  router.post('/getcaptcha',controller.user.getCaptcha);
  router.post('/register',controller.user.register);
  router.post('/login',controller.user.login);
  router.post('/setting',controller.userSetting.update);
};
