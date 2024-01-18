const express=require('express');
const answerRouter=express.Router();
const{AnswerModel}=require('../model/answer.model')
const{auth}=require('../middleware/auth.middleware')

answerRouter.use(auth)
answerRouter.get('/:questionid',async(req,res)=>{
    const questionID=req.params.questionid
try{
const answer=await AnswerModel.find({questionID})
res.status(200).json(answer);
}catch(err)
{
    res.status(400).json({error:err});
}
})


answerRouter.post('/create/:questionid',async(req,res)=>{
    const questionID=req.params.questionid
const{content}=req.body
try{
const answer=new AnswerModel({content,questionID,userID:req.body.userID,username:req.body.username})
await answer.save();
res.status(200).json({msg:'new answer has been added'})
}
catch(err)
{
    res.status(400).json({error:err});
}
})

answerRouter.delete('/delete/:id',async(req,res)=>{
    const _id=req.params.id;
    const{userID}=req.body;
    const answer= await AnswerModel.findOne({_id})
    if(userID===answer.userID)
    {
    try{
        await AnswerModel.findByIdAndDelete(_id);
        res.status(200).json({msg:'answer has been deleted'});
        }
        catch(err){
        res.status(400).json({error:err})
        }
    }
    else{
    res.json({msg:'you are not authorised'});
    }
    })


module.exports={
    answerRouter
};