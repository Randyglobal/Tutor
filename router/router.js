const express = require('express');

const router = express.Router();

const model = require('../model/user');

const multer = require('multer')

// image upload
var Storage = multer.diskStorage({
    destination: function(req, file, cb){
    cb(null, './public/uploads/');
    },
    filename: function(req, file, cd) {
        cd(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload =  multer({
    storage: Storage,
}).single("image");

// insert user to database
router.post('/add', upload, (req, res) => {
    const body = req.body;
    console.log(req.file);
    const admin = new model({
        name: body.name,
        email: body.email,
        phone: body.number,
        image: req.file.path,
    });

    admin.save().then(result => {

        console.log(result);
        req.session.message = {
            type: 'Success',
            message: 'User Added Successfully'
        };
        res.redirect('/')
    }).catch(err => {
        res.json({message: err.message, type: "Something went wrong"})
    });
})

router.get('/', (req, res,next) => {
    res.render("index", {title: 'Home Page'})
})
router.get('/add', (req, res, next) => {
    res.render('add-user', {title: 'Add User'})
})

module.exports = router