const express = require("express");
const PORT = process.env.PORT || 8080;
const body_parser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// models
const user_model = require("./models/user_model");
const shoppinglist_model = require("./models/shoppinglist_model");
const shoppinglist_item_model = require("./models/shoppinglist_item_model");

//views
const shoppinglist_views = require("./views/shoppinglist-views");

//controllers
const auth_controller = require("./controllers/auth_controller");

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




app.post("/add-shoppinglist", (req, res, next) => {
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
});

app.post("/add-shoppinglist-item", (req, res, next) => {

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
});

app.post("/delete-shoppinglist", (req, res, next) => {
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
});

app.get("/", user_is_logged_in_handler, (req, res, next) => {
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
});

app.get("/shoppinglist/:id", (req, res, next) => {
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
});

// Auth
app.use(auth_controller.handle_user);
app.get("/login", auth_controller.get_login);
app.post("/register", auth_controller.post_register);
app.post("/login", auth_controller.post_login);
app.post("/logout", auth_controller.post_logout);

// Notes

// 404
app.use((req, res, next) => {
  res.status(404);
  res.send(`404 - page not found`);
});

const mongoose_url =
  "mongodb+srv://shoppinglistappdb:a8WgpQQqyiKvdKU0@cluster0-lyyxe.mongodb.net/test?retryWrites=true&w=majority";

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
