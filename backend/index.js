require('dotenv').config()
const express=require('express')
const mongoose=require("mongoose")
const cors=require("cors")
const fileupload=require("express-fileupload")
const admin = require("firebase-admin");

const cronshedule=require('./utils/cronscheduling')

cronshedule()

const serviceAccount=JSON.parse(process.env.serviceaccount)



admin.initializeApp({
  credential: admin.cert(serviceAccount)
});


const app=express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileupload())

const port = process.env.PORT || 5000

const url="mongodb://localhost:27017/tasksuser"



mongoose.connect(url)
.then((res)=> console.log("database connected"))
.catch((rej)=> console.log("not connected"))

const loginrouter=require('./route/loginroute')
const tasksrouter=require('./route/tasksroute')

app.use("/task",loginrouter)
app.use("/task",tasksrouter)

app.listen(port,()=>{
    console.log("connected to port ",port)
    
})