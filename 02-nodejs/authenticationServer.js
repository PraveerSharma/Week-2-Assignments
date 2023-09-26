/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.use(bodyParser.json());

let users = [];

function generateUniqueID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function createAccount(req, res){
  const newUser = {
    id: generateUniqueID(),
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  } 
  let isAlreadyUser = false;

  for(const user of users){
    if(user.username == newUser.username){
      isAlreadyUser = true;
      break;
    }
  }

  if(isAlreadyUser){
    res.status(400).send("username already exists");
  }else{
    users.push(newUser);
    res.status(201).send(JSON.stringify(users));
  }
  
}

function showDetails(user){
  return {firstname: user.firstname, lastname: user.lastname, id: user.id}
}

function userDetails(req, res){
  const username = req.body.username;
  const password = req.body.password;

  for(const user of users){
    if((user.username == username) && (user.password == password)){
      const data = showDetails(user);
      res.status(200).send(JSON.stringify(data));
    }
  }
  res.status(401).send("credentials are invalid");
}

// function getUsersData(req, res){
//   const data = {
//     users: function (){
//             const answer = {}
//             for(const user of users){
//               const userData = {
//                 firstname: user.firstname,
//                 lastname: user.lastname
//               }
//               answer.push(userData);
//             }
//             return answer
//           },
    
//   }
//   res.status(200).send(JSON.stringify(data));
// }

app.get('/data', (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  

  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Invalid credentials.' });
  }

  const userData = users.map(user => ({ 
    id: user.id, 
    firstname: user.firstname, 
    lastname: user.lastname 
  }));

  console.log({ users: userData })

  res.status(200).json({ users: userData });
});

// app.get('/data', getUsersData);
app.post('/signup', createAccount);
app.post('/login', userDetails)

app.listen(PORT, () => {
  console.log(`server started at port: ${PORT}`)
});

module.exports = app;
