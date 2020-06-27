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
```javascript
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
### mongoose
In egg.js, there is a plugin called egg-mongoose. We can use it to operate the database when mongoBD used in the project. First, we should config to enbale it.
```javascript
config.mongoose = {    
    client: {      
      url: 'mongodb://localhost:27017/eggjs',
      options: {useFindAndModify: false,}
    }  
  };
```
Here we should notice the option. It equals the `set` in mongoose. Like here, if we want to use `findOneAndUpdate`, we should diable `findAndModify` firstly. And it should be written in `option`. After that, the operation is almost the same in mongoose.

Set up model and build schema first.
```javascript
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    email: {
      type:String,
    },
    username: {
      type:String,
    },
    password: {
      type:String,
    },
    role: {
      type:String,
    }
  });
  return mongoose.model('User',UserSchema,'user')
};
```
And then, operate the database with schema in service.
```javascript
async findUser(email){
    const result = await this.ctx.model.User.find({"email":email});
    return result
  }

async update(email,avatar,details){
    const result = await this.ctx.model.UserSetting.findOneAndUpdate(
      {"email":email},{"avatar":avatar,"details":details}
    ).then(
      this.ctx.status = 201,
      this.ctx.body = {msg:'modified'}
    ).catch(
      this.ctx.status = 401,
      this.ctx.body = {msg:'error'}
    )
  }
```

### Swagger
`egg-swagger-doc` is a plugin used for generating api docs. The basic way is working by documents in code like this:
```javascript
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
```javascript
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
```javascript
/**   
  * @apikey Authorization
  */
```
in code. `Authorization` means the name in header, usually it's called `Authorization`. For some servers, they check with bearer token, which means in `Authorization` it should be `Bearer ${token}` rather than `${token}`

### RSA
When we want to write data into database, we should consider about the safety of data. Database is at the risk of hacked, thus we'd like to encrypt the data. Here we can use rsa to protect the data. 

`crypto` and `OpenSSL` are involved.

Firstly, we need `OpenSSL` to generate the keys, which are private key and public key.

`OpenSSL` is a open source project, you can find it on github. Also it has a website, but the website doesn't provide a package for windows. Installing introduction on github is a little bit trouble. For simple way, we can use a third part package in windows. 

The link address is here `http://slproweb.com/products/Win32OpenSSL.html`. After OpenSSL is installed, we should add it into `PATH` to enable it. It looks like `C:/Program Files/OpenSSL-win64/bin`. Notice that it should be added in system dictionary, or you can not use the command in other places.

By now, it should work. Use command line to generate key files.
```
$ openssl　version  
//check whether openssl works

$ openssl genrsa -out rsa_private_key.pem 1024  
//generate private key

$ openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem  
//generate public key based on private key
```
Put the key in `src`, which means at the same level with `app`. This is related to the fs module in node.js. 

`fs.readFileSync()`goes through the root file. Thus when you write like `fs.readFileSync('./rsa_public_key.pem')`, the position is not where your controller or service is. It will throw an error, alarming no such file.

After everything is prepared, we can use `crypto` to finish the encryption.
```javascript
const fs = require('fs')
const crypto = require('crypto')  
//import crypto and fs module, fs module belongs to nodejs, dont need to install

const privateKey = fs.readFileSync('./rsa_private_key.pem').toString('ascii')
console.log(privateKey) 
const publicKey = fs.readFileSync('./rsa_public_key.pem').toString('ascii')
console.log(publicKey)  

const encodeData = crypto.publicEncrypt(publicKey, Buffer.from('lolipop')).toString('base64');
const decodeData = crypto.privateDecrypt(privateKey, Buffer.from(encodeData.toString('base64'), 'base64'));
console.log("encode: ", encodeData)
console.log('********************')
console.log("decode: ", decodeData.toString())
```

By the way, this is the ASH method
```javascript
async encryption(decryptedCode) {
    const salt = this.app.config.salt
    const hashSecret = this.app.config.hashSecret
    const preEncode = crypto.createHmac('sha256',hashSecret).update(decryptedCode).digest('hex')  
    const encode = crypto.createHmac('sha512',hashSecret).update(`${salt}${preEncode}`).digest('hex') 
    return encode
  }
```
### JWT
`egg-jwt` is used to generate token when users login. It's somehow used like a middleware.

Generating token:
```javascript
const jwtToken = that.app.jwt.sign(
  {    
  email: para.email,
  role: findUser[0].role   
  }, that.app.config.jwt.secret
);
```

Checking token
```javascript
// ./app/router.js

module.exports = app => {
  const { router, controller, jwt } = app; 
  router.post('/login',jwt,controller.user.login)
};
```

### An interesting plugin -- Rainbow Fart

