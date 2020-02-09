const shoppinglist_model = require("../models/shoppinglist_model");
const shoppinglist_views = require("../views/shoppinglist-views");

const get_shoppinglists = (req, res, next) => {
    const user = req.user;
    user.populate('shoppinglists')
    .execPopulate()
    .then(() => {
      console.log('user:', user);
      let data = {
        user_name: user.name,
        shoppinglists: user.shoppinglists
      }
      let html = shoppinglist_views.shoppinglists_view(data); 
      res.send(html);
    });
  }

const add_shoppinglist = (req, res, next) => {
    const user = req.user;
    let new_shoppinglist = shoppinglist_model({
      name: req.body.shoppinglist_name
    });
    new_shoppinglist.save().then(() => {
      console.log('shoppinglist saved');
      console.log('user', user)
      user.shoppinglists.push(new_shoppinglist);
      user.save().then(() => {
        return res.redirect('/');
      });
    });
  }

const delete_shoppinglist = (req, res, next) => {
    const user = req.user;
    const shoppinglist_id_to_delete = req.body.shoppinglist_id;
    
    // remove from list
    const updated_shoppinglists = user.shoppinglists.filter((shoppinglist_id) => {
      return shoppinglist_id != shoppinglist_id_to_delete;
    });
    
    user.shoppinglists = updated_shoppinglists;
  
    // remove from db
    user.save().then(() => {
      shoppinglist_model.findByIdAndRemove(shoppinglist_id_to_delete).then(() => {
        res.redirect('/');
      });
    });
  }


module.exports.get_shoppinglists = get_shoppinglists;
module.exports.add_shoppinglist = add_shoppinglist;
module.exports.delete_shoppinglist = delete_shoppinglist;
