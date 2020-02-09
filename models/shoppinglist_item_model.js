const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shoppinglist_item_schema = new Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const shoppinglist_item_model = mongoose.model(
  "shoppinglist_item",
  shoppinglist_item_schema
);

module.exports = shoppinglist_item_model;
