const express = require('express');
const model = require('../models/models');
const fs = require('fs');
const router = express.Router();

router.get('/' , (req , res) => {
    model.find().exec((err , data) => {
        if(err){
            throw err;
        }else{
            res.render('index' , {
                data: data,
                successMsg: ''
            });
        }
    })
});

router.get('/insert' , (req , res) => {
    res.render('insert' , {
        errMsg: ''
    });
});

router.post('/insert' , (req , res) => {
    const {fullname , address , tel} = req.body;

    if(fullname.length === 0){
        res.render('insert' , {
            errMsg: 'Fullname is required'
        });
    }else if(address.length === 0){
        res.render('insert' , {
            errMsg: 'Address is required'
        });
    }else if(tel.length === 0){
        res.render('insert' , {
            errMsg: 'Tel is required'
        });
    }else if(req.files === null){
        res.render('insert' , {
            errMsg: 'Image is required'
        });
    }else{
        let file = req.files.image;
        let fileName;
        let fileExtension = file.mimetype.split('/')[1];
        fileName = Date.now() + '.' + fileExtension;
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif'){
            file.mv(`public/img/${fileName}` , err => {
                if(err){
                    throw err;
                }else{
                    const data = new model({
                        fullname: fullname,
                        address: address,
                        tel: tel,
                        image: fileName
                    });
                    model.saveData(data , err =>{
                        if(err){
                            throw err;
                        }else{
                            model.find().exec((err , rows) => {
                                if(err){
                                    throw err;
                                }else{
                                    res.render('index' , {
                                        successMsg: 'Your info has been saved successfully.',
                                        data: rows
                                    });
                                }
                            });
                        }
                    })
                }
            });
        }else{
            res.render('insert' , {
                errMsg: 'The image file extension used must be png jpg gif only.'
            });
        }
    }
});

router.get('/edit/:id' , (req , res) => {
    const id = req.params.id;
    model.findById(id).exec((err , data) => {
        if(err){
            throw err;
        }else{
            res.render('update' , {
                errMsg: '',
                data: data
            });
        }
    });
});

router.post('/edit/:id' , (req , res) => {
    const id = req.params.id;
    const {fullname , address , tel} = req.body;

    model.findById(id).exec((err , data) => {
        if(err){
            throw err;
        }else{
            if(fullname.length === 0){
                res.render('update' , {
                    errMsg: 'Fullname is required',
                    data: data
                });
            }else if(address.length === 0){
                res.render('update' , {
                    errMsg: 'Address is required',
                    data: data
                });
            }else if(tel.length === 0){
                res.render('update' , {
                    errMsg: 'Tel is required',
                    data: data
                });
            }else{
                if(req.files === null){
                    const data = {
                        fullname: fullname,
                        address: address,
                        tel: tel
                    }
                    model.findByIdAndUpdate(id , data , {useFindAndModify:false}).exec(err => {
                        if(err){
                            throw err;
                        }else{
                            res.redirect('/');
                        }
                    })
                }else{
                    let file = req.files.image;
                    let fileName;
                    let fileExtension = file.mimetype.split('/')[1];
                    fileName = Date.now() + '.' + fileExtension;
                    
                    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif'){
                        file.mv(`public/img/${fileName}` , err => {
                            if(err){
                                throw err;
                            }else{
                                fs.unlink(`public/img/${data.image}` , err => {
                                    if(err){
                                        throw err;
                                    }else{
                                        const data = {
                                            fullname: fullname,
                                            address: address,
                                            tel: tel,
                                            image: fileName
                                        }
                                        model.findByIdAndUpdate(id , data , {useFindAndModify:false}).exec(err => {
                                            if(err){
                                                throw err;
                                            }else{
                                                res.redirect('/');
                                            }
                                        });
                                    }
                                });
                            }
                        })
                    }else{
                        res.render('update' , {
                            errMsg: 'The image file extension used must be png jpg gif only.',
                            data: data
                        });
                    }
                }
            }
        }
    }); 
});

router.get('/delete/:id' , (req , res) => {
    const id = req.params.id;
    model.findById(id).exec((err , rows) => {
        if(err){
            throw err;
        }else{
            fs.unlink(`public/img/${rows.image}` , err => {
                if(err){
                    throw err;
                }else{
                    model.findByIdAndDelete(id , {useFindAndModify:false}).exec(err => {
                        if(err){
                            throw err;
                        }else{
                            res.redirect('/');
                        }
                    });
                }
            })
        }
    });
});

module.exports = router;