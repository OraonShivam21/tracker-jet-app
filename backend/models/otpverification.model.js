const mongoose = require("mongoose");

const otpVerificationSchema = mongoose.Schema({
   userId : String,
   otp:String,
   createdAt:Date,
   expiresAt:Date,
},{
    versionKey:false
})

const OtpVerificationModel = mongoose.model('otp',otpVerificationSchema);

module.exports={
    OtpVerificationModel
}