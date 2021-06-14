const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  articles: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  name: { type: String },
  body: { type: String },
})


module.exports = mongoose.model('Article', schema)