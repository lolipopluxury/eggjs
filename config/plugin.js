'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  mongoose: {
    enable: true,
    package: 'egg-mongoose'
  },
  cors: {
    enable: true,
    package: 'egg-cors'
  },
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt'
  }
};
