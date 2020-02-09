const express = require("express");
const PORT = process.env.PORT || 8080;

const mongoose = require("mongoose");

//middleware
const middleware = require("./middleware/middleware");

//controllers
const auth_controller = require("./controllers/auth_controller");
const shoppinglist_controller = require('./controllers/shoppinglist_controller');
const shoppinglist_items_controller = require('./controllers/shoppinglist_item_controller');

let app = express();

const user_is_logged_in_handler = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// middleware: css
app.use(express.static(__dirname + "/public"));

// middleware: session
app.use(middleware.session_conf);

// middleware: body-parser
app.use(middleware.body_parser_conf);

// middleware: logger
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
app.get("/shoppinglist/:id", shoppinglist_items_controller.get_shoppinglist_items);
app.post("/add-shoppinglist-item", shoppinglist_items_controller.add_shoppinglist_item);
// todo remove

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
