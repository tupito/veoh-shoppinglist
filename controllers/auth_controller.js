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

const post_logout = (req, res, next) => {
    req.session.destroy();
    res.redirect("/login");
  }

module.exports.post_register = post_register;
module.exports.post_logout = post_logout;