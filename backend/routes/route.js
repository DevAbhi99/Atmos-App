const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const db=require('../config/db');

//signup logic

router.post('/signup', (req,res)=>{

const {name, email, password}=req.body;

if(name==''||email==''||password==''){
    res.status(500).json({message:'Field is empty!'});
    return;
}

bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
    
     const sql='insert into signup(name, email, password) values(?,?,?);';

      db.query(sql, [name, email, hash], (error, results)=>{

        if(error){
            console.log(`Could not send data to the database due to error ${error}`);
            res.status(500).json({message:'Error'});
            return;
        }

        res.status(200).json({message:'Successfully sent data to the database'});
      })

    });
});



});


//login logic

router.post('/login', (req,res)=>{

    const {email, password}=req.body;

    if(email==''||password==''){
    res.status(500).json({message:'Field is empty!'});
    return;
}


    const sql='select * from signup where email=?;';

db.query(sql, [email], (error, results)=>{

    if(error){
        console.log(`Could not validate with the data in the database due to error ${error}`);
        res.status(500).json({message:'Error'});
        return;
    }

    if(results.length===0){
        res.status(400).json({message:'Invalid email or password'});
    }

    const hashedPassword=results[0].password;

    bcrypt.compare(password, hashedPassword, function(err, result) {
      
     if(err){
        console.log(`Could not validate the email and password due to error ${err}`);
        return;
     }

     if(result){
        res.status(200).json({message:'Successfully Logged in'});
     }
     else{
        res.status(400).json({message:'Could not login'});
     }


});

})


})


module.exports=router;