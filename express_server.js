const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs");

const generateRandomString = (length) => {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = characters.length;
  let res = '';

  for (let i = 0; i < length; i++) {
    res += characters.charAt(Math.floor(Math.random() * charLength));
  }
  
  return res;
};

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};



const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const checkPassword = function (email, password, users) {
  for (let key in users) {
    if (users[key].email === email) {
      return users[key].password === password;
    }
  }
}

const urlsForUser = function (id) {
  if (user[id].email === "") {
    
  }
}

const lookUpUser = function (userID, users) {
  
  for (let key in users) {
    if (users[key].id === userID) return users[key];
  }

  return false;
}

const lookUpUserByEmail = function (email, users) {
  
  for (let key in users) {
    if (users[key].email === email) return users[key];
  }

  return false;
}

const isEmailTaken = function (email, users) {
  for (let key in users) {
    if (users[key].email === email) return true;
  }

  return false;
}

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/urls", (req, res) => {

  if (!req.cookies['user_id']) {
    return res.send('you are not logged in!');
  }

  const id = generateRandomString(6);
  urlDatabase[id].longURL = req.body.longURL;
  res.sendStatus(200);
  res.redirect("/urls/:id");
  //update urlDatabase[id] = req.body
  // urlDatabase
  // res.redirect('/urls/:id'); // Respond with 'Ok' (we will replace this)
});
app.get("/u/:id", (req, res) => {
  //console.log(req.params.id);
  if (!urlDatabase[req.params.id] ) {
    return res.send('the id does not exist!');
  }

  


  if (!req.cookies['user_id']) {
    return res.send('you are not logged in!');
  }
  
  const longURL = urlDatabase[req.params.id].longURL;
  //console.log(longURL);
  res.redirect(longURL);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls/:id/delete",(req,res) => {
  const id = req.params.id;
  //console.log(req.params.id);
  delete urlDatabase.id;
  res.redirect("/urls");
}) 

app.post("/urls/:id/update",(req,res) => {
  //console.log(req.body);
  const updateURL = req.body.newURL;
  const id = req.params.id;
  urlDatabase[id].longURL = updateURL;
  res.redirect("/urls");
});


app.get("/urls", (req, res) => {
  if (!req.cookies['user_id']) {
    return res.send('you are not logged in!');
  }
  const userID = req.cookies["user_id"]
  const user = lookUpUser(userID, users)
  const templateVars = { 
    urls: urlDatabase, 
    user_id: null
  };

  if(user) {
    templateVars.user_id = user.email
  }
  
  
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies['user_id']) {
    return res.redirect("/login");
  }
  res.render("urls_new");
  

});

app.get("/urls/:id", (req, res) => {
  if (!urlDatabase[req.params.id].longURL) {
    return res.send('the url does not exist!');
  }


  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id].longURL
  };
  res.render("urls_show", templateVars);

  
});

app.get("/register",(req,res) => {
  //console.log(req.body.email);
  //console.log(req.body.password);

  const user_id = req.cookies['user_id']
  const templateVars = {
    user_id: user_id
  }
  
  res.render("urls_register", templateVars);
}) ;

app.post("/register", (req, res) =>{

  if (req.cookies['user_id']) {
    return res.redirect("/urls");
  }
  const email =req.body.email
  const password = req.body.password
  //generate random ID with past function
  const newID = generateRandomString(6);
  const isTaken = isEmailTaken(email, users)


  if (email === "" || password === ""){
    return res.status(400).send('Fields cannt be empty');
  } 
  console.log('isTaken', isTaken)
  if (isTaken) return res.status(400).send('Email is taken')

    // else if (users.find(item => item.email === req.body.email)){
    // res.status(400).send("email already existed");
  //}

  //include user`s id, email, and password
  const newUser = {
    id: newID, //to-do use the new 
    email: req.body.email, // use the email from the req 
    password: req.body.password //same as above
  }

  //add a new user to the global user object
  users[newID] = newUser;
  
  //set user ID cookies with new user
  res.cookie("user_id", newID);
  console.log(users);
  //redirect to /urls page
  res.redirect("/urls");
});

app.get("/login",(req,res) => {
  if (req.cookies['user_id']) {
    return res.redirect("/urls");
  }

  // const user_id = req.cookies['user_id'];
  // const user = lookUpUser(user_id, users);

  const templateVars = {
    user_id: null
  }

  // if(user) {
  //   templateVars.user_id = user.email;

  // }

  res.render("urls_login", templateVars); 

});

app.post("/login", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  const user = lookUpUserByEmail(email, users);
  if(!user) {
    return res.status(403).send("Email not found");
  }
  
  if(!checkPassword(email, password, users)) {
    return res.status(403).send("Password not paired with email");
  } 
  
  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie['user_id'];
  res.redirect("/login");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

