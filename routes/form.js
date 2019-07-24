const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const moment = require('moment');
const Form = require('../models/Form');
const ensureAuthenticated = require('../helpers/auth');
const fs = require('fs');
const upload = require('../helpers/imageUpload');



router.get('/saveForm', ensureAuthenticated, (req, res) => {
    Form.findAll({
        where: {
            userId: req.user.id,
            status: "pending"
        },
        order: [
            ['itemName', 'ASC']
        ],
        raw: true
    }).then((forms) => {
        // pass object to saveForm.handlebar
        console.log(req.user.id);
        res.render('form/saveForm', {
            forms: forms
        });
    }).catch(err => console.log(err));
});

router.get('/showsendForm', ensureAuthenticated, (req, res) => {
    res.render('form/sendForm', { // pass object to saveForm.handlebar
        form: 'Reference Records'
    });
});
router.post('/sendForm', ensureAuthenticated, (req, res) => {
    let itemName = req.body.itemName;
    let price = req.body.price;
    let itemCode = req.body.itemCode;
    let description = req.body.description.slice(0, 1999);
    let quantity = req.body.quantity;
    let referenceNo = req.body.referenceNo;
    let dateofDelivery = moment(req.body.dateofDelivery, 'DD/MM/YYYY');
    let userId = req.user.id;
    let posterURL = req.body.posterURL;

    // res.render('form/sendForm');


    Form.create({
        itemName,
        price,
        itemCode,
        description,
        quantity,
        referenceNo,
        dateofDelivery,
        userId,
        posterURL,
        status: "pending"
    }).then((form) => {
        res.redirect('/form/saveForm');
    }).catch(err => console.log(err))

});



router.get('/saveForminDraft/:id', ensureAuthenticated, (req, res) => {
    // todo: use findOne and where : id to retrieve one form object.
    // in the .then( (form) =>  update. )

    Form.findOne({
        where: {
            id: req.params.id
        }
    }).then((form) => {
        if (form) {
            let itemName =form.itemName;
            let price =form.price;
            let itemCode = form.itemCode;
            let description = form.description;
            let quantity = form.quantity;
            let referenceNo = form.referenceNo;
            let posterURL = form.posterURL;
            let dateofDelivery = moment(form.dateofDelivery, 'DD/MM/YYYY')
            let userId = req.user.id;
            let status = "draft";

            Form.update({
                itemName,
                price,
                itemCode,
                description,
                quantity,
                referenceNo,
                posterURL,
                dateofDelivery,
                status,
                userId

            }, {
                    where: {
                        id: form.id,
                    }
                }
            ).then(() => {
                res.redirect('/form/trash');

            }).catch(err => console.log(err)); 

        }
    })





});


// Practical 10 Activity 02
// Upload poster
router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id);
    }

    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
            }
        }
    });
})

router.get('/retrieveForm/:id', ensureAuthenticated, (req, res) => {



    Form.findOne({
        where: {
            id: req.params.id
        }
    }).then((form) => {
        if (form) {
            let itemName = form.itemName;
            let price = form.price;
            let itemCode = form.itemCode;
            let description = form.description;
            let quantity = form.quantity;
            let referenceNo = form.referenceNo;
            let posterURL = form.posterURL;
            let dateofDelivery = moment(form.dateofDelivery, 'DD/MM/YYYY')
            let userId = req.user.id;
            let status = "pending";

            Form.update({
                itemName,
                price,
                itemCode,
                description,
                quantity,
                referenceNo,
                posterURL,
                dateofDelivery,
                status,
                userId

            }, {
                where: {
                    id: form.id,
                }
            }
        ).then(() => {
            res.redirect('/form/saveForm');

        }).catch(err => console.log(err)); 

    }
})
   


});

router.get('/trash', ensureAuthenticated, (req, res) => {
    Form.findAll({
        where: {
            userId: req.user.id,
            status: "draft"
        },
        order: [
            ['itemName', 'ASC']
        ],
        raw: true
    }).then((forms) => {
        // pass object to trash.handlebar
        console.log(req.user.id);
        res.render('form/trash', {
            forms: forms
        });
    }).catch(err => console.log(err));
});



const Sequelize = require('sequelize');


router.get("/search/ajax/:query", ensureAuthenticated, (req, res) => {
    let query = req.params.query;
    Video.findAll({ // select * from video where userid = ... and title like '%dark%';
        where : {
            userId: req.user.id,
            itemCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("itemCode")), 'LIKE', '%' + query + '%')
        },
        order: [
            ['itemName', 'ASC']
        ],
        raw: true
    }).then((forms) => {
        res.json({
            forms:forms
        })
    }).catch(err => console.log(err));
})


router.get('/search', ensureAuthenticated, (req, res) => {
    res.render('form/saveForm', {});
})


// Practical 10 Activity 02
// Upload poster
router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id);
    }

    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
            }
        }
    });
})


module.exports = router;