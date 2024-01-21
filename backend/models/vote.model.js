const mongoose=require('mongoose');
const voteSchema=mongoose.Schema({
    answerID:String,
    userID:String
},{
    versionKey:false
});


const VoteModel=mongoose.model('vote',voteSchema);

module.exports={
    VoteModel
};