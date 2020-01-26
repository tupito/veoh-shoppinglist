const express = require('express');
const PORT = process.env.PORT || 8080;
const body_parser = require('body-parser');
const session = require('express-session');

let app = express();

let users = [];
users.push('asdf');

// dummylists, not per user
let dummyShoppingLists = [];
let list1 = { 'id': '1', 'name':'ruokakauppa', 'items': [ {'name' : 'kurkku','quantity' : 2}, {'name' : 'tomaatti','quantity' : 5} ]}
let list2 = { 'id': '2', 'name':'muut kaupat','items': [ {'name' : 'bensa','quantity' : 55}, {'name' : 'tuoli','quantity' : 5} ]}
dummyShoppingLists.push(list1)
dummyShoppingLists.push(list2)

const user_is_logged_in_handler = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

// middleware: session
app.use(session({
    secret: '!sBSytN8]V(|<z}6JXRjt7l6r`QYj6g6lGc3j]TS:1g(fIaNZ0^*gdrqg&eE',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 100000
    }
}));

// middleware: body-parser
app.use(body_parser.urlencoded({
    extended: true
}));

// middleware: logger
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.path}`);
    next();
});

app.get('/', user_is_logged_in_handler, (req, res, next) => {
    const user = req.session.user;
    res.write(`
    <div class = "info">
        Logged in as user: ${user}
        <form action="/logout" method="POST">
            <button type="submit" class="btn-danger">Log out</button>
        </form>
    </div>

    <div class = "dummyShoppingLists">
    <h1>User's ${user} dummyShoppingLists</h1><ul>`);
    dummyShoppingLists.forEach((value, index) => {
        res.write(`<li> <a href="./shoppinglist/${value.id}"> ${value.name}</a></li>`);
    });
    res.write(`</ul></div>`);
    res.end();
    return;
});

app.get('/shoppinglist/:id', (req, res, next) => {
    const shoppinglistId = req.params.id;
    let shoppingList = dummyShoppingLists.filter((list) => {
        return list.id === shoppinglistId;
    })
    res.write(`
    <div class = "dummyShoppingLists">
    <h1>shoppinglist with id: ${req.params.id}</h1>`);
    
    console.log(shoppingList)
    console.log(shoppingList[0])

    res.write(`<ul>`)
    shoppingList[0].items.forEach((value, index) => {
        res.write(`<li>${value.name} ${value.quantity}</li>`)
    })
    res.write(`</ul><a href="/">Return</a></div>`)
    res.end();
    return;
});

app.get('/login', (req, res, next) => {
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
    `)
});

app.post('/login', (req, res, next) => {
    const username = req.body.username;
    let user = users.find((name) => {
        return username === name;
    });
    if (user) {
        console.log('User logged in: ', user);
        req.session.user = user;
        return res.redirect('/');
    }
    console.log('Username not registered: ', user);
    res.redirect('/login');
});

app.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
})

app.post('/register', (req, res, next) => {
    const username = req.body.username;
    let user = users.find((name) => {
        return username === name;
    });
    if (user) {
        return res.send(`    
            <div class="warning">
                <p>Username ${username} already registered.</p>
                <a href="/">Return</a>
            </div>
            `);
    }
    users.push(username);
    console.log('users:', users);
    res.redirect('/login')
});

// 404
app.use((req, res, next) => {
    res.status(404);
    res.send(`404 - page not found`);
});

app.listen(PORT);