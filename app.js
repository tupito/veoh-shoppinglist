const express = require('express');
const PORT = process.env.PORT || 8080;
const body_parser = require('body-parser');

let app = express();

let users = [];

// middleware: body-parser
app.use(body_parser.urlencoded({
    extended: true
}));

// middleware: logger
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.path}`);
    next();
});

app.get('/', (req, res, next) => {
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
                    <input type="text" name="user_name" id="log_user">
                    <button type="submit">Log in</button>
                </form>
                <form action="/register" method="POST">
                    <label for="reg_user">Register</label>
                    <input type="text" name="user_name" id="reg_user">
                    <button type="submit">Register</button>
                </form>
            </div>
        </body>
        </html>
    `)
})

app.post('/register', (req, res, next) => {
    const user_name = req.body.user_name;
    let user = users.find((name) => {
        return user_name === name;
    });
    if (user) {
        return res.send(`    
            <div class="warning">
                <p>Username ${user_name} already registered.</p>
                <a href="/">Return</a>
            </div>
            `);
    }
    users.push(user_name);
    console.log('users:', users);
    res.redirect('/')
});

// 404
app.use((req, res, next) => {
    res.status(404);
    res.send(`404 - page not found`);
});

app.listen(PORT);