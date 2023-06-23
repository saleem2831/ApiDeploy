const express = require("express");
const router = express.Router();
const path = require("path");

const{
    signup,
    signin,
    forgetPassword,
    getdbdetails,
    deldbdetails,
    insertuser,
    updateuser,
    upsert,
    insertuserdetails,
    updateuserdetails,
    upsertuser,

} = require("../controllers/auth");

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/forget-password",forgetPassword);
router.get("/userdetails/:id",getdbdetails);
router.delete("/deluserdetails/:id",deldbdetails);
router.post("/insert",insertuser);
router.patch("/update",updateuser);
router.put("/upsert",upsert);
router.post("/insertuser",insertuserdetails);
router.patch("/updateuser",updateuserdetails);
router.put("/upsertuser",upsertuser);





module.exports=router;
