const express = require('express');
const PORT = process.env.PORT || 8080;

let app = express();

// middleware: logger
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.path}`);
    next();
});

app.get('/', (req, res, next) => {
    res.send('root working')
})

// 404
app.use((req, res, next) => {
    res.status(404);
    res.send(`404 - page not found`);
});

app.listen(PORT);