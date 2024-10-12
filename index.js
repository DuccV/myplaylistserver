const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv')
const mongoose = require("mongoose");
const playlistRouter = require('./routes/PlaylistRoute')

dotenv.config()

const PORT = process.env.PORT
const URI = process.env.URI

const app = express()

app.use(express.json())
app.use(cors())
app.use('/playlist',playlistRouter)
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.send('Nhin Con Cac =))')
})

mongoose.connect(URI)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`Server Is Running On Port ${PORT} 🗣🔥`)
        })
    })
