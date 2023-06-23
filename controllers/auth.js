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


    const email = req.body.email;
    const sql = 'SELECT COUNT(*) AS count FROM userData WHERE email = ?';
    mySqlConnection.query(sql, [email], (error, results) => {

		const count = results[0].count;

		if( count === 1){
        console.log("email exist in db");
        var user=req.body;
        const updateQuery='update userData set firstName= ?,lastName= ?,nickName= ?,profilepic= ?,phoneNo= ?,countryCode= ?,dob = ?,city= ?,pincode= ?,password= ?,points= ?,isMailVerified= ?,userRole= ?,isTnCAccepted = ?,subscribedChannels = ? where email = ?';
        mySqlConnection.query( updateQuery,[user.firstName,user.lastName,user.nickName,user.profilePic,user.phoneNo,user.countryCode,user.dob,user.city,user.pincode,user.password,user.points,user.isMailVerified,user.userRole,user.isTnCAccepted,user.subscribedChannels,email],(err,rows)=>{
            if(err){
                console.log(err);
            }
            else{
                // console.log(rows);
                // res.send(rows);
                console.log('data Updated Successfully');
            }
        })
        return res.json({ message: "Email Already Exist" });
        }
        else{
            console.log("doesnit Exist!!")
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
               var user=req.body;
               var userData=[data.user.uid,user.firstName,user.lastName,user.nickName,data.user.email,user.profilePic,user.phoneNo,"+91",user.dob,user.city,user.pincode,data.user.providerId,0,data.user.emailVerified,user.userRole,date_time,user.isTnCAccepted,user.subscribedChannels,date_time,date_time,data.user.refreshToken,user.accessToken];
                  mySqlConnection.query("insert into userData(userID,firstName,lastName,nickName,email,profilePic,phoneNo,countryCode,dob,city,pincode,password,points,isMailVerified,userRole,tnCSignDate,isTnCAccepted,subscribedChannels,createdAt,updatedAt,refreshToken,accessToken ) values(?)",[userData],(err,rows)=>{
                      if(err){
                          console.log(err);
                          console.log("error kya ayaa")
                      }
                      else{
                          console.log(rows);
                       //    res.send(rows);
                          console.log('data Inserted Successfully');
                      }
                  })

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
        if(user.user.emailVerified==false){
            console.log("True");
            const updEmailVerify = 'update userData set isMailVerified = ?'
            mySqlConnection.query( updEmailVerify,[true],(err,rows)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log('email verified Updated Successfully');
                }
            })
        }
        else{
            console.log("False");
        }
        const updRefreshToken = 'update userData set refreshToken = ?'
            mySqlConnection.query( updRefreshToken,[user.user.refreshToken],(err,rows)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Refresh Token Updated Successfully');
                }
            })
        console.log(user.user.refreshToken);
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

//////////////////////////////////
// var user=req.body;
// mySqlConnection.query("update userData set ? where id ="+user.userID,[user],(err,rows)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         if(rows.affectedRows==0){
//             var userData=[data.user.uid,user.firstName,user.lastName,user.nickName,data.user.email,user.profilePic,user.phoneNo,"+91",user.dob,user.city,user.pincode,data.user.providerId,0,data.user.emailVerified,user.userRole,date_time,user.isTnCAccepted,user.subscribedChannels,date_time,date_time,data.user.refreshToken,user.accessToken];
//    mySqlConnection.query("insert into userData(userID,firstName,lastName,nickName,email,profilePic,phoneNo,countryCode,dob,city,pincode,password,points,isMailVerified,userRole,tnCSignDate,isTnCAccepted,subscribedChannels,createdAt,updatedAt,refreshToken,accessToken ) values(?)",[userData],(err,rows)=>{
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     // console.log(rows);
//                     res.send(rows);
//                     console.log('data Inserted Successfully');
//                 }
//             })
//         }else{
//         res.send(rows);
//         console.log('data Updated Successfully');
//         }
//     }
// })


// var user=req.body;
// //    var userAtt= [userID,firstName,lastName,nickName,email,profilePic,phoneNo,countryCode,dob,city,pincode,password,points,isMailVerified,userRole,tnCSignDate,isTnCAccepted,subscribedChannels,createdAt,updatedAt,refreshToken,accessToken];
//    var userData=[data.user.uid,user.firstName,user.lastName,user.nickName,data.user.email,user.profilePic,user.phoneNo,"+91",user.dob,user.city,user.pincode,data.user.providerId,0,data.user.emailVerified,user.userRole,date_time,user.isTnCAccepted,user.subscribedChannels,date_time,date_time,data.user.refreshToken,user.accessToken];
//    mySqlConnection.query("insert into userData(userID,firstName,lastName,nickName,email,profilePic,phoneNo,countryCode,dob,city,pincode,password,points,isMailVerified,userRole,tnCSignDate,isTnCAccepted,subscribedChannels,createdAt,updatedAt,refreshToken,accessToken ) values(?)",[userData],(err,rows)=>{
//        if(err){
//            console.log(err);
//            console.log("error kya ayaa")
//        }
//        else{
//            console.log(rows);
//         //    res.send(rows);
//            console.log('data Inserted Successfully');
//        }
//    })


