const { json } = require('body-parser');
const mysql = require('mysql2');

const mySqlConnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"2831",
    database:"saleem"
})

mySqlConnection.connect((err)=>{
    if(err){
        console.log("Error in DB Connection"+JSON.stringify(err,undefined,2));
    }
    else{
        console.log("DB Connected Succesfully");
    }
})

module.exports = mySqlConnection