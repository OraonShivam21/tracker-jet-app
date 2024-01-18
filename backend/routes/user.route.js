const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const {UserModel} = require("../models/user.model");
const {OtpVerificationModel} = require("../models/otpverification.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const { use } = require("bcrypt/promises");
// const {BlacklistModel} = require("../models/blacklist.model");
// const { use } = require("bcrypt/promises");
const userRouter = express.Router();
// Register

const transporter = nodemailer.createTransport({
    service: "gmail",
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
          const newUser = new UserModel({ name, email, password: hashPass,verified:false });
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

// Verify email
// userRouter.get("/verify/:userId/:otp",(req,res)=>{
//     let { userId, otp} = req.params;
//     const hashedOTP =  bcrypt.hash(otp,10)
//     let optPresent = OtpVerificationModel.find({userId})
//     .then((result)=>{
//         if(optPresent){
//             bcrypt.compare(hashedOTP,otp)
//             .then(result=>{
//                 if(result){
//                    UserModel.updateOne({_id:userId}, {verified:true})
//                    .then(()=>{
//                     OtpVerificationModel.deleteOne({userId})
//                     .then(()=>{
//                         res.json({msg:"Verification successfull"})
//                     }).catch(err=>{res.json(err)})
//                    })
//                    .catch(err=>{res.json({err})})
//                 }else{
//                     res.json({msg:"Incorrect OTP"})
//                 }
//             })
//             .catch(error=>{
//                 res.json(error)
//             })
//         }
//     }
//     )
//     .catch((error)=>{
//         console.log(error);
//     })
// })

userRouter.post("/verifyOTP",async(req,res)=>{
    try{
       let {userId, otp} = req.body;
       if(!userId || !otp){
        throw Error("Empty otp details are not allowed");
       }else{
        const userOtpVerificationRecords = await OtpVerificationModel.find({userId});
        if(userOtpVerificationRecords.length <= 0){
            throw new Error("Record doesn't exist !, Please signup again")
        }else{
            const {expiresAt} = userOtpVerificationRecords[0];
            const hashedOtp = userOtpVerificationRecords[0].otp;
            if(expiresAt < Date.now()){
                await OtpVerificationModel.deleteMany({userId})
                throw new Error("Code has expired, please request again")
            }else{
               const validOtp = await bcrypt.compare(otp, hashedOtp)
               if(!validOtp){
                throw new Error("Invalid code passed")
               }else{
                UserModel.updateOne({_id:userId},{verified:true})
                OtpVerificationModel.deleteMany({userId})
                res.json({
                    status:"VERIFIED",
                    message:'User email verified successfully'
                })
               }
            }
        }
       }
    }
    catch(err){
        res.json({err});
    }
})




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