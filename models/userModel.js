const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the user name"]
    },
    email: {
        type: String,
        required: [true, "Please add the user Email"],
        unique:[true,"Email address already taken"]
    },
    password:{
        type: String,
        required: [true, "Please add password"],
    },
},
    {
        timestamps: true,
    }
);

module.exports =mongoose.model("User",userSchema);


// {
//     "username": "bulbul",
//     "email": "bulbul99@gmail.com",
//     "id": "645fc5b8649774748852ba64"
//   }