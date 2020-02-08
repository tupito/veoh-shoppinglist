const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shoppinglist_schema = new Schema({
  name: {
    type: String,
    required: true
  }
});

const shoppinglist_model = new mongoose.model(
  "shoppinglist",
  shoppinglist_schema
);

module.exports = shoppinglist_model;
