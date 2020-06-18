module.exports = (options,app) => {
  return async function interceptor(ctx,next) {
    console.log('------------------')
    console.log(ctx.request)
    console.log(ctx.session.csrfToken)
    console.log('******************')
    await next()
  }
}