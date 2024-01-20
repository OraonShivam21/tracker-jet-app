const mongoose=require('mongoose');
const answerSchema=mongoose.Schema({
    content:{type: String, required:true},
    userID:String,
    username:String,
    upvote:{type:Number, default:0},
    downvote:{type:Number, default:0},
    questionID:String,
    createdAt: { type: Date, default: Date.now }
},{
    versionKey:false
});


const AnswerModel=mongoose.model('answer',answerSchema);

module.exports={
    AnswerModel
};