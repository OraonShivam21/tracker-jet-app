const express=require('express');
const answerRouter=express.Router();
const{AnswerModel}=require('../models/answer.model')
const{auth}=require('../middlewares/auth.middleware')
const{VoteModel}=require('../models/vote.model')

answerRouter.use(auth)
answerRouter.get('/:questionid',async(req,res)=>{
    const questionID=req.params.questionid
try{
    const upvote='upvote'; 
const answer=await AnswerModel.find({questionID}).sort({[upvote]:'desc'})
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


    answerRouter.patch('/upvote/:answerID',async(req,res)=>{
        const answerID=req.params.answerID
        const {userID}=req.body
        try{
            const vote = await VoteModel.findOne({ $and: [{ userID }, { answerID }] });
            if(vote)
            {
                res.status(200).json({msg:'you can only vote once'})
            }
            else{
                const addvote=new VoteModel({userID,answerID})
                await addvote.save()
                const answer=await AnswerModel.findOne({_id:answerID})
                let number=answer.upvote
                number+=1;
                await AnswerModel.findByIdAndUpdate(answerID,{upvote:number})
                res.status(200).json({msg:'upvote has beeen increased'})
            }
        }
        catch(err)
        {
            res.status(400).json({error:err})
        }
    })

    answerRouter.patch('/downvote/:answerID',async(req,res)=>{
        const answerID=req.params.answerID
        const {userID}=req.body
        try{
            const vote = await VoteModel.findOne({ $and: [{ userID }, { answerID }] });
            if(vote)
            {
                res.status(200).json({msg:'you can only vote once'})
            }
            else{
                const addvote=new VoteModel({userID,answerID})
                await addvote.save()
                const answer=await AnswerModel.findOne({_id:answerID})
                let number=answer.upvote
                number-=1;
                await AnswerModel.findByIdAndUpdate(answerID,{upvote:number})
                res.status(200).json({msg:'you downvoted the user'})
            }
        }
        catch(err)
        {
            res.status(400).json({error:err})
        }
    })


module.exports={
    answerRouter
};