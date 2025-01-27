const express = require("express")
const cors = require('cors');
const fs = require("fs");

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());;

app.get('https://karamatisyntax.github.io/ESports/', (req, res) => {
  if(req.query.user == undefined || req.query.id == undefined){
    res.sendFile('signup.html', {root: 'https://karamatisyntax.github.io/ESports/'})
  }
  else{
    res.sendFile('Lndex.html', {root: 'https://karamatisyntax.github.io/ESports/'});
  }
})
let data = fs.readFileSync("./user.json");
let myObject = JSON.parse(data);

// Function to check if a user exists
function userExists(username) {
    return myObject.some(user => user.username == username);
}

app.post('https://karamatisyntax.github.io/ESports/signup', (req, res) => {
    const inputValue = req.body
    const usernameToCheck = inputValue.username;

    if (userExists(usernameToCheck)) {
        res.send("username already exists");
    }else {
      let NEWuser = {
          "username": `${inputValue.username}`,
          "password": `${inputValue.password}`
          }
        
          myObject.push(NEWuser);
          // let newData2 = JSON.stringify(myObject);
          let newData2 = JSON.stringify(myObject)
          
          fs.writeFile("./user.json", newData2, (err) => {
          // Error checking
          if (err) throw err;
          });
      
        // Process the input value or save to database
        res.send(`Welcome player!! ${inputValue.username}`)
    }
});

app.post('https://karamatisyntax.github.io/ESports/login', (req, res) => {
    const inputValue = req.body
    const usernameToCheck = inputValue.username;

    if (userExists(usernameToCheck)) {
      if( myObject.some(user => user.password == inputValue.password)){
        res.send(`Welcome player!! ${inputValue.username}`);
      }else{
        res.send("worng password!!")
      }
    }else {
        res.send("username don't exit");
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
