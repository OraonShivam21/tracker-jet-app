const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const {UserModel} = require("../models/user.model");
const {OtpVerificationModel} = require("../models/otpverification.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
// const {BlacklistModel} = require("../models/blacklist.models");
// const { use } = require("bcrypt/promises");
const userRouter = express.Router();
// Register

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 535,
  secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });
transporter.verify((err,success)=>{
    if(err){
        console.log(err);
    }else{
        console.log("ready for message");
        console.log(success);
    }
})

userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      res.json({ msg: "Email already used!" });
    } else {
      const salt = 3;
      bcrypt.hash(password, salt)
        .then((hashPass) => {
          const newUser = new UserModel({ name, email, password: hashPass });
          newUser.save()
            .then((result) => {
              sendOtpVerificatiionEmail(result,res);
            })
            .catch((err) => {
              res.json({ err });
            });
        });
    }
  });
  
   
const sendOtpVerificatiionEmail = async({_id,email},res)=>{
    try{
      const otp = `${Math.floor(1000+Math.random()*9000)}`;


    const mailOptions = {
        from:process.env.AUTH_EMAIL,
        to:email,
        subject:"Verify your Email",
        html:`<p>Enter <b>${otp}</b> in the app to verify your email </p>
        <p>This code <b>expires in 1 hour</b>.</p>`,
    };
    const saltRound = 10;
    const hashedOTP = await bcrypt.hash(otp,saltRound);
    const newOTPVerification = await new OtpVerificationModel({
        userId:_id,
        otp:hashedOTP,
        createdAt:Date.now(),
        expiresAt:Date.now()+3600000
    });
    await newOTPVerification.save();
    transporter.sendMail(mailOptions);
    res.json({
        status:"PENDING",
        message:"Verification otp email sent",
        data:{
            userId:_id,
            email,
        },
    })
    }
    catch(err){
       res.json({
        status:"FAILED",
        message:err.message,
       })
    }
}






// Login
userRouter.post("/login",async(req,res)=>{
    const {email, password} = req.body;
    try{
       const user = await UserModel.findOne({email});
       if(user){
        bcrypt.compare(password,user.password,(err, result)=>{
            if(result){
                const access_token = jwt.sign({userID: user._id, user:user.name},process.env.accessSecret);
                // const refresh_token = jwt.sign({userID: user._id, user:user.name},"Prity");
                res.json({msg:"Login Successful", user,access_token});
                
            }else{
                res.json({msg:"Wrong email and password"})
            }
        })
       }
    }catch(err){
          res.json({err})
    }
})


// userRouter.get("/logout",async(req,res)=>{
//     const access_token = req.headers.authorization?.split(" ")[1];
//     const refresh_token = req.headers.authorization?.split(" ")[2];
//     try{
//     const blacklist = new BlacklistModel({access_token,refresh_token})
//     await blacklist.save();
//     res.status(200).json({msg:"User has been logges out"})
//     }
//     catch(err){
//       res.json({err});
//     }
// })






module.exports = {
    userRouter
}