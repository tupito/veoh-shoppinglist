const express = require("express");
const PORT = process.env.PORT || 8080;
const body_parser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");

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
app.use(
  session({
    secret: "!sBSytN8]V(|<z}6JXRjt7l6r`QYj6g6lGc3j]TS:1g(fIaNZ0^*gdrqg&eE",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 100000
    }
  })
);

// middleware: body-parser
app.use(
  body_parser.urlencoded({
    extended: true
  })
);

// middleware: logger
app.use((req, res, next) => {
  console.log(`${req.method} - ${req.path}`);
  next();
});

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
