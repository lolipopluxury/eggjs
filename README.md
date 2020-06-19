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

### CSRF
Some developers find the api dosen't work when sending a post request. The reason is that in egg.js, there is already a plugin setted for csrf. It checks all post requests, and refuses the request without csrf token by default. When a user want to access the api, it should get a csrf token first, and put the token in form as `_csrf`. Many answers on the internet tell how to disable the plugin, but few ones tell how to config in correct way.

There are two ways to send the token. First one is putting in cookie and another one is in session. Concerning security, we can send by session.
```
config.security = {
    csrf: {  
      enable:true,
      useSession: true,  
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
    }
  };
```
The token is read in this way
```
async getToken(){
    const { ctx } = this;  
    const token = ctx.session.csrfToken  
    ctx.body = {msg:'token get',code:200,data:token};     
  }
```


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
For first learners, two things may make feel puzzled. First one is how to change the content type of request, and the second one is how to add token in request header.

The answer is in `consumes` and `securityDefinitions`

In `consumes`, don't write an array, or it'll not work. Token in request header belongs to api key, and `securityDefinitions` enables it. Once you want an api checked, add 
```
/**   
  * @apikey Authorization
  */
```
in code. `Authorization` means the name in header, usually it's called `Authorization`. For some servers, they check with bearer token, which means in `Authorization` it should be `Bearer ${token}` rather than `${token}`

