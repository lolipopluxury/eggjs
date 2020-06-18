module.exports = (options,app) => {
  return async function interceptor(ctx,next) {
    console.log('inter1')
    console.log('inter2')
    await next()
  }
}