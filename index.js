const express = require('express')
const app = express()
const port = 3110
const dbConnection = require('./db')
const cors = require('cors');
const Route = require('./routes/Routes')
require('dotenv').config()
app.use(cors());
app.use(express.json()) 
app.use('/', Route)
app.get("/",(req,res)=>{
  res.json({message:"Server is Running"})
})

dbConnection()

app.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}`)
})
