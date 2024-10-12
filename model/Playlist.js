const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Playlist = new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    songs:[
        {
            name:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ]
}, { timestamps: true })

module.exports = Playlists = mongoose.model("Playlist", Playlist)