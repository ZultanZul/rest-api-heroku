const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const PORT = process.env.PORT || 3333;
// const DATABASE =  MONGODB_URI || 'mongodb://localhost/first_servers';


const {
    MONGODB_URI
} = process.env;


const app = express();


// Initialise FileServer in public Dir
//////////////////

app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());



// Connect to the Database.
//////////////////

mongoose.Promise = global.Promise;
var promise = mongoose.connect(MONGODB_URI ||'mongodb://localhost/first_servers',{useNewUrlParser:true});

promise.then(function(db) {
  console.log(`DATABASE CONNECTED!!`);
}).catch(function(err){
  console.log('CONNECTION ERROR', err);
});



// Begin Schema
//////////////////
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    phone: String,
    type: String,
    avatar: String
},{timestamps:{createdAt: 'createdAt'}});

const User = mongoose.model('User', userSchema);






// Query the DB for Users
//////////////////

app.get('/users', function(req, res, next){
    console.log('get all')
    User.find({})
    .exec(function(err, result){
        if(err) return res.status(500).send(err);
        console.log('sending all')
        res.status(200).json(result);
    });
});




// Post new User to DB
//////////////////

app.post('/users', function(req, res){
    console.log('create user')
    const userData = req.body;
    console.log('userData', userData);
  
    const newUser = new User(userData);
    console.log('user', newUser);
  
    newUser.save(function(err, result){
      if (err) return res.status(500).send(err);
        console.log('creating user')
      res.status(200).json(result);
    });
  
  });





// Query the DB for Specific User
//////////////////

app.get('/users/:userid', function(req, res, next){

console.log('get one')
    const userToFind = req.params.userid;
    console.log('User to be find: ' + userToFind); 

    User.find({
        _id: userToFind
    })
    .exec(function(err, result){
        if(err) return res.status(500).send(err);
        console.log('sending one')
        res.status(200).json(result);
    });
});





// Update Specific User by ID
//////////////////

app.put('/users/:userid', (req, res) => {
    console.log('updating user')
    const userToUpdate = req.params.userid;
    console.log('User to be Updated: ' + userToUpdate);  

    console.log('req.body' + req.body)

    User.update ({
        _id: userToUpdate
    }, req.body, function(err, resp){
        if(err) return res.status(500).send(err);
        console.log('updated user')
        res.sendStatus(200);
    })
});





// Delete user from DB
//////////////////

app.delete('/users/:userid', (req, res) => {
    console.log('deleting user')
    const userToDelete = req.params.userid;
    console.log('User to be Deleted: ' + userToDelete);

    User.remove({
        _id: userToDelete
    }, function(err, resp){
        if(err) return res.status(500).send(err);
        console.log('deleted user')
        res.sendStatus(204);
    });
  
  });




  
// Spin Up the Server
//////////////////

app.listen(PORT, function(){
    console.log(`Server is listening:  ${PORT}`);
});