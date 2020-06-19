# Backend Based on Egg.js 

## QuickStart
see [egg docs][egg] for more detail. Choose simple-temp for js. Ts is not recommended in egg.

[egg]: https://eggjs.org
### Plugins 
`egg-mongoose`
`egg-cors`
`egg-swagger-doc`
`egg-jwt`
### Dependency
`crypto`
`validator`

OpenSSL is required for RSA
## Notice

### Swagger
`egg-swagger-doc` is a plugin used for generating api docs. The basic way is working by documents in code like this:
```
/**
 *  @Controller index
 */

/**
   * @summary Function_Test
   * @description test
   * @router get /
   * @apikey Authorization
   */
```
Of course the plugin should config first
```
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
```
For first learners, two things may makes feel puzzled. First one is how to change the content type in request header, and the  second
one is how to add token in request.

The answer is in `consumes` and `securityDefinitions`

In `consumes`, don't write an array, or it'll not work. Token in request header belongs to api key, and `securityDefinitions` enables it. Once you want an api checked, add 
```
/**   
  * @apikey Authorization
  */
```
in code. `Authorization` means the name in header, usually it's called `Authorization`. For some servers, they check with bearer token, which means in `Authorization` it should be ``Bearer ${token}`` rather than ``${token}``