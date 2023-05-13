//@desc get all contacts
//@route GET/api/contacts
//@access public
// we need to make all routes private =>use vaalidatetoken as midddleware for all the routes here
const dotenv = require("dotenv").config();
const Contact =require("../models/contactModel")
const asyncHandler= require("express-async-handler");

const getContacts= asyncHandler(async(req, res) => {
    const contacts= await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});

const createContact=asyncHandler( async (req, res) => {
    console.log("The request body is : ",req.body);
    const {name,email,phone}=req.body;
    if(!name || !email || !phone){
        res.status(404);
        throw new Error("All fields are Mandatory");
    }
    const user= await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id
    })
    res.status(201).json(user)
});

const updateContact= asyncHandler (async(req, res) => {
    const contact=await Contact.findById(req.params.id);
    // console.log("here",contact);
    if(!contact){
        res.status(404);
        throw new Error("No contact found");
    }
    if(contact.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("User doesnt have permission to update other user contact");
    }
    const updatedContact=await Contact.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.status(200).json(updatedContact);
});
const getContact=asyncHandler (async (req, res) => {
    const contact=await Contact.findById(req.params.id);
    console.log("here",contact);
    if(!contact){
        //not working 
        res.status(404);
        throw new Error("Contact not found");
    }
    else{
        res.status(200).json(contact);
    }
});

const deleteContact=asyncHandler( async (req, res) => {
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("User doesnt have permission to update other user contact");
    }
    const deletedContact=await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedContact);
});


module.exports= {getContacts,getContact,createContact,updateContact,deleteContact};