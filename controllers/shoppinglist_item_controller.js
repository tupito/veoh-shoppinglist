const shoppinglist_model = require("../models/shoppinglist_model");
const shoppinglist_item_model = require("../models/shoppinglist_item_model")
const shoppinglist_views = require("../views/shoppinglist-views");

const get_shoppinglist_items = (req, res, next) => {
    const shoppinglist_id = req.params.id;
    shoppinglist_model.findOne({
      _id: shoppinglist_id
    }).then((shoppinglist) => {
      shoppinglist.populate('shoppinglist_items')
      .execPopulate()
      .then(() => {
        res.send(shoppinglist_views.shoppinglist_items_view(shoppinglist))
      })
    });
  }

  const add_shoppinglist_item = (req, res, next) => {
    let new_shoppinglist_item = shoppinglist_item_model({
      name: req.body.item_name,
      quantity: req.body.item_quantity,
      image: req.body.item_image_url
    });
  
    // find shoppinglist
    shoppinglist_model
    .findById(req.body.shoppinglist_id)
    .then(shoppinglist => {
      console.log(shoppinglist)
      // insert new item
      new_shoppinglist_item.save().then(() => {
        shoppinglist.shoppinglist_items.push(new_shoppinglist_item);
        shoppinglist.save().then(() => {
          return res.redirect('/shoppinglist/' + req.body.shoppinglist_id);
        });
      });
    }).catch(err => {
      console.log(err);
    });
  }  

module.exports.get_shoppinglist_items = get_shoppinglist_items;
module.exports.add_shoppinglist_item = add_shoppinglist_item;