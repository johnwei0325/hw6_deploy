import {Router} from "express";
import ScoreCard from '../models/ScoreCard.js';
const router=Router();
router.delete("/cards",async(req,res)=>{
    try{
        await ScoreCard.deleteMany({});
        console.log('Database deleted');
        res.json({message:"Database cleared"});
    }catch(e){throw new Error("Database deletion failed!")};
});

/* 
router.post("/card",(req,res)=>{ 
    console.log(`ddddd${req.query}`);  
})*/  
const saveUser=async(name,subject,score,res)=>{
    const exiting=await ScoreCard.findOne({name,subject});
    if(exiting){    
        let target=ScoreCard.findOne({name:name,subject:subject});
       // ScoreCard.findOne({name:name,subject:subject},(err,obj)=>{console.log(obj);target=obj;});
      // const newScoreCard=new ScoreCard({name,subject,score});
        let apple= await ScoreCard.updateOne(target,{$set:{name:name,subject:subject,score:score}});
        let objs=await ScoreCard.find({name:name});
        res.json({message:`Updating (${name},${subject},${score})`,card:true,tablemsg:objs});
         
    }else{
        //const newScoreCard=new ScoreCard({name,subject,score});
        let tmp=await ScoreCard.insertMany([{name:name,subject:subject,score:score}]);
        let objs=await ScoreCard.find({name:name});
        res.json({message:`Adding (${name},${subject},${score})`,card:true,tablemsg:objs});
        //return newScoreCard.save();
    }    
}
router.post("/card",(req,res)=>{
    console.log(req.body)
    const newname=req.body.name;
    const newsubject=req.body.subject; 
    const newscore=req.body.score; 
    console.log(`n:${newname},s:${newsubject},sc:${newscore}`);
    if(!newname||!newsubject||isNaN(newscore)){
        res.json({message:"Cannot be empty!",card:false});
    }else{
        saveUser(newname,newsubject,newscore,res);
    }      
     
})
router.get("/cards",async(req,res)=>{ 
    const type=req.query.type;
    const string=req.query.queryString;
    console.log(type);
    let objs;
    if(type==='name'){
        objs=await ScoreCard.find({name:string});
        console.log(objs);       
    }else{
        objs=await ScoreCard.find({subject:string});
        console.log(objs[0]); 
    }
    if(objs[0]===undefined){       
        console.log("apple");
        res.json({messages:false,message:`${type},${string} not found!`,tablemsg:objs});
    }else{ 
      // console.log(objs);   
      console.log("egg");
      let messages=[...objs.map((e)=>`Found card with ${type}:(${e.name},${e.subject},${e.score})`)];
        res.json({messages:messages,message:"Querry Success!",tablemsg:objs}); 
    }
});      
export default router;  