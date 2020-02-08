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
const auth_views = require("./views/auth-views");

let app = express();

// dummies
const dummy = require("./dummies");
let dummies = dummy.shoppingLists();

// current user's shopping lists
let shoppinglists = [];

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

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  user_model
    .findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
      res.redirect("login");
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

app.post("/add-shoppinglist", (req, res, next) => {
  const user = req.user;
  let new_shoppinglist = shoppinglist_model({
    name: req.body.shoppinglist_name
  });
  new_shoppinglist.save().then(() => {
    console.log('shoppinglist saved');
    user.shoppinglists.push(new_shoppinglist);
    user.save().then(() => {
      return res.redirect('/');
    });
  });
});

app.get("/shoppinglist/:id", (req, res, next) => {
  const shoppinglistId = req.params.id;

  // etsi halutun listan tuotteet
  let shoppingList = shoppingLists.filter(list => {
    return list.id === shoppinglistId;
  });
  res.write(`
    <div class = "shoppingLists">
    <h1>shoppinglist with id: ${req.params.id}</h1>`);

  console.log(shoppingList);
  console.log(shoppingList[0]);

  res.write(`<ul>`);
  shoppingList[0].items.forEach((value, index) => {
    res.write(`<li>${value.name} ${value.quantity}</li>`);
  });
  res.write(`</ul><a href="/">Return</a></div>`);
  res.end();
  return;
});

app.get("/login", (req, res, next) => {
  res.send(auth_views.login_view())
});

app.post("/login", (req, res, next) => {
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
});

app.post("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
});

app.post("/register", (req, res, next) => {
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
});

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
