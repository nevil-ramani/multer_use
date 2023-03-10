const express = require('express');
const multer = require("multer");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('tiny'));



const storage = multer.diskStorage( {
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        const filename = file.fieldname + Math.floor((Math.random() * 100) + 1) + Date.now() + path.extname(file.originalname); //file.originalname.toLowerCase().split(' ').join('-');
        cb(null, filename);
    }

})

const imgType = ["image/png", "image/jpeg", "image/jpg"];


const upload = multer({
    // dest: 'public'
    storage: storage,   //after creating storage function
    fileFilter: (req, file, cb) => {


        const filesize = req.headers["content-length"];
        if(!imgType.includes(file.mimetype)){
            cb(new Error("Invalid file type"));
        } else if(filesize > 1024 * 1024 * 5){
            cb(new Error("file too large"))
        }else(cb(null, true))
    }
}
).single('image');




app.post('/api/upload',upload, (req,res) => {
    console.log(path.join(__dirname,req.file.path));
    const uploaddata = {
        id: req.body.id,
        name: req.body.name,
        message: 'file is uploded',
        file: path.join(__dirname,req.file.path)
    };
    res.send(uploaddata);
})

app.listen(3000, () => { console.log('server is running on http://localhost:3000')});