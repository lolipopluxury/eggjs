module.exports = (options,app) => {
  return async function interceptor(ctx,next) {    
    const csrfGet = ctx.state.user.csrfToken
    console.log(csrfGet)
    const _csrfToken = ctx.session.csrfToken
    console.log(_csrfToken)
    if(csrfGet === _csrfToken) {
      await next()
    }else {
      ctx.body = 'no'
    }
  }
}