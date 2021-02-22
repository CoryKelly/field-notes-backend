const { Schema, model } = require('mongoose')

const postSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: { type: String, required: true },
  notes: String,
  task: { type: String, required: true },
  product: String,
  amount: String,
  units: String,
  zone: [String],
  mowHeight: String,
  date: String,
  photo: { type: String, required: true }
})

module.exports = model('Post', postSchema)
