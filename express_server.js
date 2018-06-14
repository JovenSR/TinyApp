const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;

}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "hello@fakemail.com",
    password: "password1"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "hi@fakemail.com",
    password: "password2"
  }

}

app.get("/register", (req, res) => {
  res.render("registration");
})

app.post("/register", (req, res) => {
  let userID = generateRandomString();
  users[userID] = req.body;
  res.cookie('user_id', users[userID]);
  res.redirect('/urls');

})

app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie('username',username);
  res.redirect('/urls');
})

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
})

app.get("/urls", (req, res) => {
  let templateVars;
  templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index",templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  console.log('delete');
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

app.get("/urls/new", (req, res) => {
  var templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);

});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  var shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = req.body.longURL;
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});