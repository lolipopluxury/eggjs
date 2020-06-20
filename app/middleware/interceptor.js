module.exports = (options,app) => {
  return async function interceptor(ctx,next) {    
    const csrfGet = ctx.state.user.csrfToken    
    const _csrfToken = ctx.session.csrfToken    
    if(csrfGet === _csrfToken) {
      await next()  
    }else {
      ctx.status = 403
      ctx.body = {msg:'User identification fails'}
    }
  }
}