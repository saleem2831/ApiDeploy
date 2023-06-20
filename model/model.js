const userSchema = ({
        firstName:{type:String},
        lastName:{type:String},
        nickName:{type:String},
        email:{type:String,required:true},
        profilePic:{type:String},
        phoneNo:{type:String},
        countryCode:{type:String},
        dob:{type:String},
        city :{type:String},   
        pincode:{type:Number},
        userID:{type:String},
        password:{type:String,required:true},
        points:{type:Number},
        isMailVerified:{type:Boolean},
        userRole:{type:String},
        tnCSignDate:{type:Date},
        isTnCAccepted:{type:Boolean},
        subscribedChannels:{type:String},
        createdAt:{type:Date},
        updatedAt:{type:Date},
        accessToken:{type:String},
        refreshToken:{type:String}
})

module.exports = userSchema;
