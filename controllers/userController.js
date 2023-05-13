const User =require("../models/userModel")
const asyncHandler= require("express-async-handler");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
// register a user
//post
const registerUser= asyncHandler(async(req, res) =>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are Mandatory");
    }
    const userAvailable=await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    //hash password
    const hashedPassword=await bcrypt.hash(password,10);
    console.log(hashedPassword)
    const newUser= await User.create({
        username,
        email,
        password:hashedPassword,
    })
    console.log("usercreated",newUser);
    if(newUser){
        res.status(201).json({_id:newUser.id,email:newUser.email});
    }
    else{
        res.status(400);
        throw new Error("user data is not valid");
    }
    // res.status(200).json({message:"register the user"})
});

const loginUser= asyncHandler(async(req, res) =>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are madatory");
    }
    //check if user exissts or not
    const userCheck= await User.findOne({email});
    if(userCheck &&(await bcrypt.compare(password,userCheck.password) )){
        //provide accesss token
        const accessToken=jwt.sign({
            user:{
                username:userCheck.username,
                email:userCheck.email,
                id:userCheck.id,
            },
        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"10m"}

        );

        res.status(200).json({accessToken});

    }
    else{
        res.status(401);
        throw new Error("Email or password not valid");
    }
});

//private method
//client has to pass access token
const currentUser= asyncHandler(async(req, res) =>{
    res.json(req.user);
});


module.exports={registerUser,loginUser,currentUser};