const express=require('express');
const questionRouter=express.Router();
const{QuestionModel}=require('../model/question.model')
const{auth}=require('../middleware/auth.middleware')

questionRouter.use(auth)
questionRouter.get('/mine',async(req,res)=>{
try{
const question=await QuestionModel.find({userID:req.body.userID})
res.status(200).json(question);
}catch(err)
{
    res.status(400).json({error:err});
}
})
questionRouter.get('/:questionid',async(req,res)=>{
    const _id=req.params.questionid
    try{
    const question=await QuestionModel.findOne({_id})
    res.status(200).json(question);
    }catch(err)
    {
        res.status(400).json({error:err});
    }
    })


questionRouter.get('/',async(req,res)=>{
    try{
    const question=await QuestionModel.find()
    res.status(200).json(question);
    }catch(err)
    {
        res.status(400).json({error:err});
    }
    })

questionRouter.post('/create',async(req,res)=>{
const{title,body,userID,username,tags}=req.body
try{
const question=new QuestionModel({title,body,userID,username,tags})
await question.save();
res.status(200).json({msg:'new question has been created'})
}
catch(err)
{
    res.status(400).json({error:err});
}
})


questionRouter.delete('/delete/:id',async(req,res)=>{
const _id=req.params.id;
const{userID}=req.body;
const question= await QuestionModel.findOne({_id})
if(userID===question.userID)
{
try{
    await QuestionModel.findByIdAndDelete(_id);
    res.status(200).json({msg:'question has been deleted'});
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
    questionRouter
};