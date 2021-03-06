const shoppinglist_model = require("../models/shoppinglist_model");
const shoppinglist_item_model = require("../models/shoppinglist_item_model")
const shoppinglist_views = require("../views/shoppinglist-views");

const get_shoppinglist_items = (req, res, next) => {
  console.log(req.params)
  const shoppinglist_id = req.params.id;
  shoppinglist_model.findOne({
    _id: shoppinglist_id
  }).then((shoppinglist) => {

    let data = {
      shoppinglist: shoppinglist,
      user_name: req.user.name
    }

    shoppinglist.populate('shoppinglist_items')
    .execPopulate()
    .then(() => {
      res.send(shoppinglist_views.shoppinglist_items_view(data))
    })
  }).catch(err => {
    console.log(err);
  });
}

const add_shoppinglist_item = (req, res, next) => {

  if (req.body.item_name && req.body.item_quantity) {
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
  else {
    return res.redirect('/shoppinglist/' + req.body.shoppinglist_id);
  }
}

const update_shoppinglist_quantity = (req, res, next) => {

  console.log(req.params)

  let quantity_change = parseInt(req.params.edit) // -1 || 1

  // find shoppinglist item
  shoppinglist_item_model
  .findById(req.body.shoppinglist_item_id)
  .then(item => {
      console.log(item)
      item.quantity += quantity_change
      item.save().then(() => {
        return res.redirect('/shoppinglist/' + req.body.shoppinglist_id);  
      });
  }).catch(err => {
    console.log(err);
  });
}

const delete_shoppinglist_item = (req, res, next) => {

  const shoppinglist_item_id_to_delete = req.body.shoppinglist_item_id;

  // find shoppinglist
  shoppinglist_model
  .findById(req.body.shoppinglist_id)
  .then(shoppinglist => {

    //remove from list
    const updated_shoppinglist_items = shoppinglist.shoppinglist_items.filter((shoppinglist_item_id) => {
      return shoppinglist_item_id != shoppinglist_item_id_to_delete;
    });

    shoppinglist.shoppinglist_items = updated_shoppinglist_items;

    //remove from db
    shoppinglist.save().then(() => {
      shoppinglist_item_model.findByIdAndRemove(shoppinglist_item_id_to_delete).then(() => {
        res.redirect('/shoppinglist/' + req.body.shoppinglist_id);
      });
    });
  });
}

module.exports.get_shoppinglist_items = get_shoppinglist_items;
module.exports.add_shoppinglist_item = add_shoppinglist_item;
module.exports.delete_shoppinglist_item = delete_shoppinglist_item;
module.exports.update_shoppinglist_quantity = update_shoppinglist_quantity;