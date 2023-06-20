const express = require("express");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
const dbconnection = require("./config/dbconnection");

const app = express();

//Routes 
const authRoutes = require("./routes/auth");

// Middle Ware
app.use(bodyParser.json());

//Routes
 app.use("/api",authRoutes);

 app.get("/", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });

   app.get("/rest", (req, res, next) => {
    res.json(["MERCEDES","AUDI","BMW"]);
   });

// Port
const port = 3000;

//Starting Server

app.listen(port,()=>{
    console.log("Server is Running On Port : ",port);
})

module.exports = app;