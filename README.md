# MongoDP with Mongoose
==========================================


- ### Installation...
```
  npm install mongoose
```

- ### Importing...
```
  import mongoose from 'mongoose';
```

- ### Connecting...
   - Define Url for future use
   ```
    const Url = "mongodb+srv://<db_username>:1234mana%40@matches.da46xak.mongodb.net/?retryWrites=true&w=majority&appName=Matches"
   ```
   your DBname is in the url, so if you want to **create a database** in Matches cluster name your data base in url lick, i want to create:-

   **Matches**<Sub>Cluster</sub> >> **Users**<sub>DBname</sub> >> Documents of Users
   
   So, I have to **modify url**:- 
   
   ***Users*** (after **.net/**) → Specifies that your database is ***"Users"***, so MongoDB will not default to **"test"** database.
   
   So, Motified Url should be:-
   ```
    const Url = "mongodb+srv://<db_username>:1234mana%40@matches.da46xak.mongodb.net/Users?retryWrites=true&w=majority&appName=Matches";
   ```
   
   - connect with mongodb
   ```
   mongoose
    .connect(Url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting:", err));
    
   ```
  
  - make shema & Modals
 
    **Schema** is mongoose feature, a blueprint for submitting details for example if you want to make a blueprint for users signup data:-
  ```
  const userSchema = new mongoose.Schema({
      name: String,
      age: Number,
      email: {
        type: String,
        required: true,
        unique: true
      },
      registered: Boolean,
  })
  ```
    Ones Schema is done we have to convert schema to **Model for CURD Operations** for example:-
  ```
    // mongoose.model('Name', schema);
    const User = mongoose.model('User', userSchema);
  ```
   Now we can do CURD Opretions with model named User

- ### CURD Oprerations...
  - Create
  ```
    const newUser = new User({ 
      name: "John Doe", 
      email: "john@example.com", 
      age: 25,
      registered: false
    });
    
    newUser.save()
    .then(() => console.log("User added!"))
    .catch(err => console.error(err));
  ```

   - Update 
   ```
    user.update({name: "john Doe"}, {registered: true})
   ```

   - Read 
   ```
   const allUsers = User.find({});
   console.log(allUsers)
   
   const john = User.find({name: "John Doe"})
   console.log(john)
   
   cont johnwithID = User.findByID(23qu67djj)
   console.log(johnwithID)
   ```

   - Delete
   ```
    User.delete({name: "john Doe"})
   ```
    
  ***Note*** 
   > It is a Node.js file it can through **error** in **next js** you have use your own brain for implemet these functions in next js best practices is to make function repeatative... with the help of AIs use different files for different operations lick For Connecting use ***../lib/mongoConnect.jsx*** it will return function of connection and function can be call many time when you needed...
