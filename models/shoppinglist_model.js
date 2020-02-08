const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shoppinglist_schema = new Schema({
  name: {
    type: String,
    required: true
  },
  shoppinglist_items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shoppinglist_item",
      req: true
    }
  ]
});

const shoppinglist_model = new mongoose.model(
  "shoppinglist",
  shoppinglist_schema
);

module.exports = shoppinglist_model;
