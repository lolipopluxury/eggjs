module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const homePageContentSchema = new Schema({
    block1: {
      type:String,
    },
    block2: {
      type:String,
    },
    block3: {
      type:String,
    },
  });
  return mongoose.model('HomePageContent',homePageContentSchema,'homePageContent')
}