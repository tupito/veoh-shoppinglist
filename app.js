const express = require("express");
const PORT = process.env.PORT || 8080;
const body_parser = require("body-parser");
const session = require("express-session");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
  name: {
    type: String,
    required: true
  }
});
const user_model = mongoose.model('user', user_schema);

let app = express();

// dummies
const dummy = require("./dummies");
let dummies = dummy.shoppingLists();
let users = [];

// current user's shopping lists
let shoppingLists = [];

//console.log(JSON.stringify( shoppingLists ))

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
  user_model.findById(req.session.user._id).then((user) => {
    req.user = user;
    next();
  })
});

app.get("/", user_is_logged_in_handler, (req, res, next) => {
  const user = req.user;
  res.write(`
    <div class = "info">
        Logged in as user: ${user.name}
        <form action="/logout" method="POST">
            <button type="submit" class="btn-danger">Log out</button>
        </form>
    </div>

    <div class = "shoppingLists">
    <h1>User's ${user.name} shoppingLists</h1><ul>`);

  // etsi kirjautuneen käyttäjän kauppalistat
  let userCol = dummies.filter(list => {
    return list.user === user;
  });

  shoppingLists = userCol[0].shoppingLists;

  // käyttäjän ruokalistat
  shoppingLists.forEach((value, index) => {
    res.write(
      `<li> <a href="./shoppinglist/${value.id}"> ${value.name}</a></li>`
    );
  });
  res.write(`</ul></div>`);
  res.end();
  return;
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
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
            <link rel="stylesheet" type="text/css" href="./style.css">
            <title>ShoppinglistApp</title>
        </head>
        <body>
            <div id="login_reg_container">
                <form action="/login" method="POST">
                    <label for="log_user">Login</label>
                    <input type="text" name="username" id="log_user">
                    <button type="submit" class="btn-primary">Log in</button>
                </form>
                <form action="/register" method="POST">
                    <label for="reg_user">Register</label>
                    <input type="text" name="username" id="reg_user">
                    <button type="submit" class="btn-primary">Register</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post("/login", (req, res, next) => {
  const user_name = req.body.username;
  user_model.findOne({
    name: user_name
  }).then((user) => {
    if (user) {
      req.session.user = user;
      return res.redirect('/');
    }
    res.redirect('/login');
  });
});

app.post("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
});

app.post("/register", (req, res, next) => {
  const user_name = req.body.username;

  user_model.findOne({
    name: user_name
  }).then((user) => {
    if (user) {
      console.log('user name already registered');
      return res.redirect('/login');
    }

    let new_user = new user_model({
      name: user_name
    });

    new_user.save().then(() => {
      return res.redirect('/login');
    });
  });
});

// 404
app.use((req, res, next) => {
  res.status(404);
  res.send(`404 - page not found`);
});

const mongoose_url = 'mongodb+srv://shoppinglistappdb:a8WgpQQqyiKvdKU0@cluster0-lyyxe.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(mongoose_url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.log('Mongoosed connected');
  console.log('Start Express server');
  app.listen(PORT);  
});
