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

var urlDatabase = {};

var users = {
  // "userRandomID": {
  //   id: "userRandomID",
  //   email: "hello@fakemail.com",
  //   password: "password1"
  // },
}

function checkEmail(email){

  var flag = true;
  for(var key in users){
    if(users[key].email===email){
      flag = false;
      // console.log("it matched email");
    }
  }
  return flag;
}

function checkPassword(email, password){
  for(var key in users) {
    if(users[key].email===email) {
      var id = users[key].password;
      return id;
    }
  }
}

function urlsForUser(userId) {
  var newObj = {}
  for(var key in urlDatabase) {
    if(userId === urlDatabase[key].userID) {
      newObj[key] = urlDatabase[key]
    }

  }
  return newObj;
    // return subset of urldatabase that belongs to the user in the input
}

app.get("/register", (req, res) => {
  res.render("registration");
})

app.post("/register", (req, res) => {

  //Check whether email is empty or password length is 0
  if(req.body.email.length === 0 || req.body.password.length === 0) {
      res.status(400).send("Please fill out all fields");
  }

  let userID = generateRandomString();
  let email = req.body.email
  let password = req.body.password

  //check for the existing Email
  if(checkEmail(req.body.email)){
    // console.log("user email does not exist, you can register");
    const newUser = {
      id : userID,
      email : email,
      password : password
    }
    //Add the new user
    users[userID] = newUser;
    res.cookie('user_id', users[userID].id);
    console.log(users);
    res.redirect('/urls');

  } else {
    res.send('Email already registered. Please try again with another one');
  }

});

app.get("/login", (req, res) => {
  res.render('login');
})

app.post("/login", (req, res) => {
  if(checkEmail(req.body.email)) {
    res.status(403).send("That email is not registered with us. Please create an acoount");
  } else if
    (checkEmail(req.body.email) === false &&  checkPassword(req.body.email, req.body.password) !== req.body.password) {
      res.status(403).send('Incorrect password');
    } else {
      for(var key in users) {
        if(users[key].email === req.body.email) {
          res.cookie('user_id', users[key].id)

        }
      }

    } res.redirect('/urls');

})

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
})

app.get("/urls", (req, res) => {
  if(!req.cookies.user_id) {
    res.send("Please sign in to see urls");
  } else {
  var templateVars = { urls: urlsForUser(req.cookies.user_id), user: req.cookies.user_id};
  // var templateVars = { urls: urlDatabase, user: req.cookies.user_id};
  }
  console.log("*********");
  console.log(templateVars.urls);
  console.log("**********");
  res.render("urls_index",templateVars);
});

app.post("/urls/:id/delete", (req, res) => {

  delete urlDatabase[req.params.id];
  res.redirect('/urls');
})

app.get("/urls/new", (req, res) => {
  var templateVars = {user: req.cookies.user_id};
  if(!templateVars.user) {
    res.redirect('/login');
  }
  res.render("urls_new", templateVars);

});

app.post("/urls", (req, res) => {
  var templateVars = {user: req.cookies.user_id};
  var shortUrl = generateRandomString();
  var longURL = req.body.longURL;
  var userURL = {
    userID: templateVars.user,
    longURL: longURL
  };
  // urlDatabase[templateVars.user["id"]] = userURL;
  urlDatabase[shortUrl] = userURL;
  console.log("hellooooooooooo");
  console.log(urlDatabase);
  console.log("helooooooooooooo");
  res.redirect('/urls');
});


app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  res.redirect(urlDatabase[shortURL].longURL);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    user: req.cookies.user_id
  };
  if(!templateVars.user) {
    res.send("Please sign in");
  } else if (templateVars.user !== urlDatabase[req.params.id].userID) {
    res.send("No access");
  }

  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id]["longURL"] = req.body.longURL;
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
  res.redirect("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});