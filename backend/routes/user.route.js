const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const {UserModel} = require("../models/user.model");
const {OtpVerificationModel} = require("../models/otpverification.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const { use } = require("bcrypt/promises");
const {BlacklistModel} = require("../models/blacklist.model")

// const { use } = require("bcrypt/promises");
const userRouter = express.Router();
// Register

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
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
        email:email,
        otp:hashedOTP,
        createdAt:Date.now(),
        expiresAt:Date.now()+3600000
    });
    await Promise.all([newOTPVerification.save(),
    transporter.sendMail(mailOptions)])
    res.status(200).json({
        status:"PENDING",
        message:"Verification otp email sent",
        data:{
            userId:_id,
            email,
        },
    })
    }
    catch(err){
       res.status(400).json({
        msg:err.message,
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
       let {email,otp} = req.body;
       if(!otp){
        res.status(400).json({msg:"Empty otp details are not allowed"})
        // throw Error("Empty otp details are not allowed");
       }
        const userOtpVerificationRecords = await OtpVerificationModel.find({email});
        // if(userOtpVerificationRecords.length <= 0){
        //     res.json({msg:"Record doesn't exist !, Please signup again"})
        //     // throw "Record doesn't exist !, Please signup again"
        // }
            const {expiresAt} = userOtpVerificationRecords[0];
            const hashedOtp = userOtpVerificationRecords[0].otp;
            if(expiresAt < Date.now()){
                await OtpVerificationModel.deleteMany({email})
                res.status(400).json({msg:"Code Expired"})
                // throw "Code has expired, please request again"
            }else{
               const validOtp = await bcrypt.compare(otp, hashedOtp)
               if(!validOtp){
                res.status(400).json({msg:"Worng otp"})
                
               }else{
                // await UserModel.updateOne({_id:userId},{verified:true})
               await OtpVerificationModel.deleteMany({email})
                res.status(200).json({msg:'User email verified successfully'})
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
                const token = jwt.sign({userId: user._id, user:user.name,username:user.name},process.env.accessSecret);
                // const refresh_token = jwt.sign({userID: user._id, user:user.name},"Prity");
                res.status(200).json({msg:"Login Successful", user,token});
                
            }else{
                res.status(400).json({msg:"Wrong email and password"})
            }
        })
       }
    }catch(err){
          res.json({err})
    }
})


userRouter.get("/logout",async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1];
   
    try{
    const blacklist = new BlacklistModel({token})
    await blacklist.save();
    res.status(200).json({msg:"User has been logges out"})
    }
    catch(err){
      res.status(400).json({err});
    }
})

userRouter.patch("/update/:id", async (req, res) => {
  const {id}= req.params;
  const payload = req.body;

  try {
    // const user = await UserModel.findById(userId);

    if (payload._id == req.body._id) {
      await noteModel.findByIdAndUpdate({ _id: id }, payload);
      res.status(200).json({ msg: "note has been updated" });
    }
    else {
      res.status(200).json({ msg: "You are not authorized to update this note" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
}
);

// noteRouter.patch("/update/:noteID",async(req,res)=>{
//   const {noteID} = req.params;
//   const payload = req.body;
//   try{
//     if(payload.userID === req.body.userID){
//       await NoteModel.findByIdAndUpdate({_id:noteID},payload);
//       res.status(200).json({msg:"Notes Updated"})
//     }
//   }catch(err){
//       res.status(400).json({err})
//   }
// })



module.exports = {
    userRouter
}