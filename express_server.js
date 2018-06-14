var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString() {
  //logic to generate a random string
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;

}

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.post("/login", (req, res) => {

  var username = req.body.username;
  res.cookie('username',username);
  //var templateVars = { urls: urlDatabase, username: username};
  res.redirect('/urls');

})

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
})

app.get("/urls", (req, res) => {

  // if(req.cookie["username"]===undefined){
  //   console.log("hi there ");
  // }
  console.log("rohit test :",req.cookies);
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
  res.redirect('/urls');         // Respond with 'Ok' (we will replace this)
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