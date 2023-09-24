const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 600);
  })
  .then((result) => {
    return res.send(JSON.stringify(books, null, 4))
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books[isbn]), 600);
  });

  const book = await promise
  if (book){
    return res.send(books[isbn])
  }
  else{
    res.send("Unable to find book!");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let authors_found = Object.values(books).find(obj => obj.author === author);
      resolve(authors_found);
    }, 600);
  });

  const authors_found = await promise;

  if (authors_found.length > 0){
    res.send(authors_found)
  }
  else{
    res.send("Unable to find book!");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  if (title){
    let titles_found = Object.values(books).find(obj => obj.title === title);
    res.send(titles_found)
  }
  else{
    res.send("Unable to find book!");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  if (isbn){
    return res.send(books[isbn].reviews)
  }
  else{
    res.send("Unable to find book!");
  }
});

module.exports.general = public_users;
