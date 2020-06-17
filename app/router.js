'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/',jwt, controller.home.index);
  router.get('/token',controller.csrf.getToken);
  router.post('/register',controller.user.register);
  router.post('/login',controller.user.login)
};
