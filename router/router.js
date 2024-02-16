const express = require('express');

const router = express.Router();

const model = require('../model/user');

const multer = require('multer')

const fs = require('fs')

// image upload
var Storage = multer.diskStorage({
    destination: function(req, file, cb){
    cb(null, './public/uploads/');
    },
    filename: function(req, file, cd) {
        cd(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload =  multer({
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

// Getting all users from route
router.get('/', (req, res,next) => {
    model.find().exec((error, user) =>{
        if (error) {
            res.json({message: error.message});
        }else{
            res.render("index", {title: 'Home Page', user: user})
        }
    })
})

router.get('/add', (req, res, next) => {
    res.render('add-user', {title: 'Add User'})
})
// edit user
router.get('/edit/:id', (req, res, next) => {
    let id = req.params.id;
    model.findById(id, (err, user) => {
        if (err) {
            res.redirect('/')
        }else{
            if (user == null) {
                res.redirect('/')
            }else{
                res.render('edit_user', {title: 'Edit user', user: user})
            }
        }
    })
})
router.post('/update/:id', (req, res)=> {
    let id = req.params.id;
    let new_image = '';

    
    if (req.file && Object.keys(req.file).length != 0) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync(req.body.old_image)
        } catch (error) {
            console.log(error);
        }
    }else{
        new_image = req.body.old_image
    }

    model.findByIdAndUpdate(id, { $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.number,
            image: new_image
    }}, (err, result)=>{
        if (err) {
            res.json({message: err.message, type: 'danger'})
        }else{
            req.session.message = {
                type: 'success',
                message: 'User Updated Successfully'
            };
            res.redirect('/')
        }
        console.log(req.body);
    }
    )
})
// Deleting User
router.get('/delete/:id', (req, res) =>{
    let id = req.params.id;
    model.findByIdAndRemove(id, (err, result) => {
        if (result.image != '') {
            try {
                fs.unlinkSync('./public/uploads/'+ result.image)
            } catch (error) {
                console.log(error);
            }
        }
        if (err) {
            res.json({message: err.message})
        }else{
            req.session.message = {
                type: 'info',
                message: 'User deleted Successfully!!'
            }
            res.redirect('/')
        }
    })
})

module.exports = router