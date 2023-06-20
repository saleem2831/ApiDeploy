const firebase = require("../config/firebase");
const mySqlConnection = require("../config/dbconnection");
const userSchema = require("../model/model")




// Signup  
exports.signup=(req,res)=>{
    const db = firebase.firestore();
const user = db.collection("users");

    if(!req.body.email || !req.body.password){
        return res.status(422).json({
            email:"Email is required",
            password:"Password is Required"
        }); 
    }
   
    // user.add(data2)
    // res.send({msg:"user Added"});
    firebase
    .auth()
    .createUserWithEmailAndPassword(req.body.email,req.body.password)
    .then(function(data){
        firebase.auth().currentUser.sendEmailVerification()
       .then(() => {
           // Email verification sent!
           console.log('Email Verification sent! Check your mail box');
           // ...
       });
       const date_time = new Date();
       const userSchema = {
               firstName:req.body.firstName,
               lastName:req.body.lastName,
               nickName:req.body.nickName,
               email:data.user.email,
               profilePic:req.body.profilePic,
               phoneNo:req.body.phoneNo,
               countryCode:"+91",
               dob:req.body.dob,
               city:req.body.city,   
               pincode:req.body.pincode,
               userID:data.user.uid,
               password:data.user.providerId,
               points:0,
               isMailVerified:data.user.emailVerified,
               userRole:req.body.userRole,
               tnCSignDate:date_time,
               isTnCAccepted:req.body.isTnCAccepted,
               subscribedChannels:req.body.subscribedChannels,
               createdAt:date_time,
               updatedAt:date_time,
            //    accessToken:data.user.stsTokenManager.accessToken,
               refreshToken:data.user.refreshToken        
       }

    //    console.log("access token:",data.user.stsTokenManager);
       console.log("data of users",userSchema);
    //    user.add(userSchema);
    //    const data2 = req.body;
    // console.log("data of users",data2);
    // const x=user.add(data2);
    // console.log(x);
    // user.add();
   
        user.add(userSchema);
        return res.status(201).json(data);

    })
    .catch(function(error){
        let errorCode = error.code;
        let errorMessage = error.message;
        if(errorCode=="auth/weak-password"){
            return res.status(500).json({error:errorMessage});
        }
        else{
            return res.status(500).json({error:errorMessage});
        }
    });
};



// SignIn

exports.signin=(req,res)=>{
    if(!req.body.email || !req.body.password){
        return res.status(422).json({
            email:"Email is required",
            password:"Password is Required"
        });
    }
    firebase
    .auth()
    .signInWithEmailAndPassword(req.body.email,req.body.password)
    .then((user)=>{
        return res.status(201).json(user.user);
    })
    .catch(function(error){
        let errorCode = error.code;
        let errorMessage = error.message;
        if(errorCode=="auth/wrong-password"){
            return res.status(500).json({error:errorMessage});
        }
        else{
            return res.status(500).json({error:errorMessage});
        }
    });
};

// Forgot Password

exports.forgetPassword=(req,res)=>{
    if(!req.body.email){
        return res.status(422).json({
            email:"Email is required"
        });
    }
    firebase
    .auth()
    .currentUser
    .sendPasswordResetEmail(req.body.email)
    .then(function(){
        sendEmailVerification();
        return res.status(201).json({starus:"Password Reset Email Sent"});
    })
    .catch(function(error){
        let errorCode = error.code;
        let errorMessage = error.message;
        if(errorCode=="auth/invalid-email"){
            return res.status(500).json({error:errorMessage});
        }
        else if(errorCode=="auth/user-not-found"){
            return res.status(500).json({error:errorMessage});
        }
    });
};

//DB fetch/get operation
exports.getdbdetails=(req,res)=>{
// mySqlConnection.query("select * from test2",(err,rows)=>{
    mySqlConnection.query("select * from test2 where id=?",[req.params.id,req.query],(err,rows)=>{

    if(err){
        console.log(err);
    }
    else{
        // console.log(rows);
        res.send(rows);
    }
})
}

exports.deldbdetails=(req,res)=>{
    mySqlConnection.query("delete from test2 where id=?",[req.params.id],(err,rows)=>{
        // mySqlConnection.query("select * from test2 where id=?",[req.params.id],(err,rows)=>{
    
        if(err){
            console.log(err);
        }
        else{
            // console.log(rows);
            res.send(rows);
        }
    })
    }
// Insert
    exports.insertuser=(req,res)=>{
        var user=req.body;
        var userData=[user.id,user.name,user.salary];
        mySqlConnection.query("insert into test2(id,name,salary) values(?)",[userData],(err,rows)=>{
            if(err){
                console.log(err);
            }
            else{
                // console.log(rows);
                res.send(rows);
                console.log('data Inserted Successfully');
            }
        })
    }

    //Update
    exports.updateuser=(req,res)=>{
        var user=req.body;
        mySqlConnection.query("update test2 set ? where id ="+user.id,[user],(err,rows)=>{
            if(err){
                console.log(err);
            }
            else{
                // console.log(rows);
                res.send(rows);
                console.log('data Updated Successfully');
            }
        })
    }

    //Insert Or Update
   
    exports.upsert=(req,res)=>{
        var user=req.body;
        mySqlConnection.query("update test2 set ? where id ="+user.id,[user],(err,rows)=>{
            if(err){
                console.log(err);
            }
            else{
                if(rows.affectedRows==0){
                    var userData=[user.id,user.name,user.salary];
                    mySqlConnection.query("insert into test2(id,name,salary) values(?)",[userData],(err,rows)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            // console.log(rows);
                            res.send(rows);
                            console.log('data Inserted Successfully');
                        }
                    })
                }else{
                res.send(rows);
                console.log('data Updated Successfully');
                }
            }
        })
    }

/// Insert User Data from user table

    exports.insertuserdetails=(req,res)=>{
        var user=req.body;
        var userData=[user.firstName,user.lastName,user.nickName,user.email,user.profilePic,user.phoneNo,user.countryCode,user.dob,user.city,user.pincode,user.userID,user.password,user.points,user.isMailVerified,user.userRole,user.tnCSignDate,user.isTnCAccepted,user.subscribedChannels,user.createdAt,user.updatedAt];
        mySqlConnection.query("insert into user(firstName,lastName,nickName,email,profilePic,phoneNo,countryCode,dob,city,pincode,userID,password,points,isMailVerified,userRole,tnCSignDate,isTnCAccepted,subscribedChannels,createdAt,updatedAt) values(?)",[userData],(err,rows)=>{
            if(err){
                console.log(err);
            }
            else{
                // console.log(rows);
                res.send(rows);
                console.log('data Inserted Successfully');
            }
        })
    }

// upsert User Details
    exports.upsertuser=(req,res)=>{
        var user=req.body;
        mySqlConnection.query("update user set ? where pincode ="+user.pincode,[user],(err,rows)=>{            if(err){
                console.log(err);
            }
            else{
                if(rows.affectedRows==0){
                    var userData=[user.firstName,user.lastName,user.nickName,user.email,user.profilePic,user.phoneNo,user.countryCode,user.dob,user.city,user.pincode,user.userID,user.password,user.points,user.isMailVerified,user.userRole,user.tnCSignDate,user.isTnCAccepted,user.subscribedChannels,user.createdAt,user.updatedAt];
                    mySqlConnection.query("insert into user(firstName,lastName,nickName,email,profilePic,phoneNo,countryCode,dob,city,pincode,userID,password,points,isMailVerified,userRole,tnCSignDate,isTnCAccepted,subscribedChannels,createdAt,updatedAt) values(?)",[userData],(err,rows)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            // console.log(rows);
                            res.send(rows);
                            console.log('data Inserted Successfully');
                        }
                    })
                }else{
                res.send(rows);
                console.log('data Updated Successfully');
                }
            }
        })
    }

//Update User Details
exports.updateuserdetails=(req,res)=>{
    var user=req.body;
    mySqlConnection.query("update user set ? where userID =+user.userID",[user],(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            // console.log(rows);
            res.send(rows);
            console.log('data Updated Successfully');
        }
    })
}

exports.rest=(req, res, next) => {
    res.json(["MERCEDES","AUDI","BMW"]);
   };