const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const { uploadFile } = require('./s3.js');



const app = express();
const port = 3000


mongoose.connect("mongodb+srv://19131a04d1:v7IeFiv28kUGDsoC@cluster0.trhnljw.mongodb.net/travelapp");

app.use(bodyParser.json());
app.use(cors());

const upload = multer({dest : 'Images' });




const userSchema = new mongoose.Schema({
    userName: String,
    password: String
});

const postSchema = new mongoose.Schema({
    country: String,
    state: String,
    place: String,
    experience: String,
    date: Date,
    files : [String]
})

const user = mongoose.model('Users', userSchema);
const post = mongoose.model('Posts', postSchema);


var postCount = 0;

app.post('/signup', (req, res) => {
    console.log(req.body);
    const { userName, password } = req.body;
    
    const newUser = new user({ userName, password });
    newUser.save();
    res.json({ userName, password });

})

app.post('/login', (req, res) => {
    const {userName, password} = req.body;
    const exists = user.findOne({ userName });
    if (exists) {
        res.json({exist : true});
    } else {
        res.json({exist : false});
    }
});


app.post('/add', upload.any(), (req, res) => {
    try {
        postCount += 1;
        const filePaths = [];
        for (var number = 0; number < req.files.length; number++) {
            const URL = uploadFile(req.files[number].path,number,postCount);
            filePaths.push(URL);
        }
        
        const newPost = new post({ country: req.body.country, state: req.body.state, place: req.body.place, experience: req.body.experience, date: req.body.date, files: filePaths });
        newPost.save();
        res.send("Succesfully added");
    }
    catch (err) {
        console.log(err);
        res.send("Error while adding");
    }


})

app.get('/feed', (req, res) => {
    const feed = post.find();
  
    res.json({ feed });

})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})