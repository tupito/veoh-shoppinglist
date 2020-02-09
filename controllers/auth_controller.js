const user_model = require("../models/user_model")
const auth_views = require("../views/auth-views");

const post_register = (req, res, next) => {
    const user_name = req.body.username;
  
    user_model
      .findOne({
        name: user_name
      })
      .then(user => {
        if (user) {
          console.log("user name already registered");
          return res.redirect("/login");
        }
  
        let new_user = new user_model({
          name: user_name
        });
  
        new_user.save().then(() => {
          return res.redirect("/login");
        });
      });
  }

const get_login = (req, res, next) => {
    res.send(auth_views.login_view())
  }

const post_login = (req, res, next) => {
    const user_name = req.body.username;
    user_model
      .findOne({
        name: user_name
      })
      .then(user => {
        if (user) {
          req.session.user = user;
          return res.redirect("/");
        }
        res.redirect("/login");
      });
  }

const post_logout = (req, res, next) => {
    req.session.destroy();
    res.redirect("/login");
  }

module.exports.post_register = post_register;
module.exports.get_login = get_login;
module.exports.post_login = post_login;
module.exports.post_logout = post_logout;