const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
  name: {
    type: String,
    required: true
  }
});
const user_model = mongoose.model('user', user_schema);

module.exports = user_model;