const express = require("express");
const playlistRouter = express.Router();
const Playlists = require('../model/Playlist')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + 'iuem' + file.originalname)
    }
})

playlistRouter.get('/', (req, res) => {
    Playlists.find()
        .then((result) => {
            res.json(result)
        })
})

const upload = multer({ storage: storage })

playlistRouter.post('/new', upload.fields([
    {
        name: "Image",
        maxCount: 1
    },
    {
        name: "Songs",
        maxCount: 50
    }
]), (req, res) => {
    try {
        const { name, songName } = req.body
        const image = req.files['Image'][0]
        const songs = req.files['Songs'].map((song, i) => ({
            name: JSON.parse(songName)[i],
            url: song.filename
        }))
        console.log(image)
        console.log(JSON.parse(songName))

        if (!req.files['Songs'] || req.files['Songs'].length === 0) {
            return res.status(400).json({ error: 'DCMMMM' });
        }

        if (!req.files['Image'] || req.files['Image'].length === 0) {
            return res.status(400).json({ error: 'DCMMMM' });
        }

        const newPlaylist = new Playlists({
            name: name,
            image: image.filename,
            songs: songs
        })

        newPlaylist.save()
            .then((result) => {
                res.status(200).json(result)
            })

    } catch (err) {
        console.error('Error creating playlist:', err);
        res.status(500).send('Internal Server Error');
    }
})

playlistRouter.get('/findbyid', (req, res) => {
    if (req.query.id){
        Playlists.findById(req.query.id)
        .then(result=>{
            res.json(result)
        })
    }else{
        res.send('Yia Yia')
    }
})


playlistRouter.post('/addsongs', upload.fields([
    {
        name: "Image",
        maxCount: 1
    },
    {
        name: "Songs",
        maxCount: 50
    }
]), async (req, res) => {
    try {
        const { songName } = req.body;

        if (!req.files['Songs'] || req.files['Songs'].length === 0) {
            return res.status(400).json({ error: 'At least one song file is required.' });
        }

        const songs = req.files['Songs'].map((song, i) => ({
            name: JSON.parse(songName)[i],
            url: song.filename
        }));

        console.log(JSON.parse(songName));
        console.log(req.query.id);

        const result = await Playlists.updateOne(
            { _id: req.query.id },
            { $push: { songs: { $each: songs } } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Playlist not found or no songs added.' });
        }

        res.status(200).json({ message: 'Songs added successfully', result });
    } catch (err) {
        console.error('Error adding songs:', err);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = playlistRouter