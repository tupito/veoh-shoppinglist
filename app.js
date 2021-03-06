const express = require("express");
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");

const middleware = require("./middleware/middleware");

//controllers
const auth_controller = require("./controllers/auth_controller");
const shoppinglist_controller = require('./controllers/shoppinglist_controller');
const shoppinglist_item_controller = require('./controllers/shoppinglist_item_controller');

let app = express();

const user_is_logged_in_handler = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// middleware
app.use(express.static(__dirname + "/public"));
app.use(middleware.session_conf);
app.use(middleware.body_parser_conf);
app.use(middleware.logger);

// Auth
app.use(auth_controller.handle_user);
app.get("/login", auth_controller.get_login);
app.post("/register", auth_controller.post_register);
app.post("/login", auth_controller.post_login);
app.post("/logout", auth_controller.post_logout);

// Shoppinglist
app.get("/", user_is_logged_in_handler, shoppinglist_controller.get_shoppinglists);
app.post("/add-shoppinglist", shoppinglist_controller.add_shoppinglist);
app.post("/delete-shoppinglist", shoppinglist_controller.delete_shoppinglist);

// Shoppinglist items
app.get("/shoppinglist/:id", shoppinglist_item_controller.get_shoppinglist_items);
app.post("/add-shoppinglist-item", shoppinglist_item_controller.add_shoppinglist_item);
app.post("/delete-shoppinglist-item", shoppinglist_item_controller.delete_shoppinglist_item);
app.post("/update_shoppinglist_quantity/:edit", shoppinglist_item_controller.update_shoppinglist_quantity);

// 404
app.use((req, res, next) => {
  res.status(404);
  res.send(`404 - page not found`);
});

const mongoose_url = "mongodb+srv://shoppinglistappdb:a8WgpQQqyiKvdKU0@cluster0-lyyxe.mongodb.net/test?retryWrites=true&w=majority";

mongoose
  .connect(mongoose_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Mongoosed connected");
    console.log("Start Express server");
    app.listen(PORT);
  });
