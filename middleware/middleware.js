const session = require("express-session");
const body_parser = require("body-parser");

const body_parser_conf = body_parser.urlencoded({
    extended: true
  })

const session_conf =  session({
    secret: "!sBSytN8]V(|<z}6JXRjt7l6r`QYj6g6lGc3j]TS:1g(fIaNZ0^*gdrqg&eE",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 100000
    }
  })

const logger = (req, res, next) => {
    console.log(`${req.method} - ${req.path}`);
    next();
  }


module.exports.body_parser_conf = body_parser_conf;
module.exports.session_conf = session_conf;
module.exports.logger = logger;