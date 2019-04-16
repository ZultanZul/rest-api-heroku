# REST API for Users


A RESTful API that connects to a MongoDB database using Mongoose to create Schemas. Example of the Schema below:

~~~~
const userSchema = new Schema({
    name: {type:String,required:true},
    email: {type:String,required:true},
    phone: String,
    admin: String,
    avatar: String
},{timestamps:{createdAt: 'createdAt'}});
~~~~


## To **CREATE** a new User

`POST` to `/users` with the required fields and types in the above schema. A valid request would be:
~~~~
{
    "name": "Jonathan1 Halliwell",
    "email": "jrhalli1well@email.com",
    "phone": "1234566798",
    "admin": false,
    "avatar": "url/url/filepath/image.jpg"
}
~~~~


## To **READ** existing Users

`GET` to `/users` will show all the existing users in the DB

To read a specific users details, pass in the userID param:

`GET` to `/users` with userID `/5ca3bb429c06c430fc9899c0`



## To **UPDATE** an existing User

`PUT` to `/users` with userID `/5ca3bb429c06c430fc9899c0` that you wish to modify.

~~~~
{
    "name": "New Name here",
    "email": "New Email here"
}
~~~~


## To **DELETE** an existing User

`DELETE` to `/users` with userID `/5ca3bb429c06c430fc9899c0` that you wish to Remove from the DB.
