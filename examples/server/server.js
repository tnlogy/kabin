var express = require('express');
var app = express.createServer();
var kabin = require('../../kabin');
var db = new kabin.JSON({path: './db'});

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "there is no invisible hand" }));

// Authentification
app.get(/^(?!\/login)/, function (req, res, next) {
  if(!req.session) {
    next(); // request without session, such as favicon.ico
  } else if(req.session.user) {
    req.db = db.namespaces[req.session.user];
    next();
  } else {
    res.redirect('/login');
  }
});

app.get("/login", function (req, res) {
  res.render("login.jade", {status: ""});
});
app.post("/login", function (req, res) {
  var username = req.body.username;
  var password = req.body.password; 
  var user = db.users[username];
  if(user && user.authentificate(password)) {
    req.session.user = username;
    res.redirect("/");
  } else {
    res.render("login.jade", {status: "Wrong password"});
  }
});
app.get("/logout", function (req, res) {
  delete req.session.user;
  res.redirect("/");
})

app.get('/', function (req, res) {
  res.render("index.jade", {db: req.db});
})

app.listen(9000, "127.0.0.1");
