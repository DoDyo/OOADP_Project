const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const moment = require('moment');
const Form = require('../models/Form');
const envelope = require('../models/envelope');
const formList = require('../models/formList')
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
    console.log('wwwwwww')
    // create the envolope here!!!!
  
    
   
    res.render('form/sendForm', { // pass object to saveForm.handlebar
        form: 'Reference Records',
        // this should be the envelope id
    });
});


// router.get('/showAddVideo', ensureAuthenticated, (req, res) => {
//     res.render('video/addVideo', { // pass object to listVideos.handlebar
//         videos: 'List of videos'
//     });
// });
router.post('/sendForm', ensureAuthenticated, (req, res) => {
    let merchant = req.user.name;
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
        merchant,
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
        envelope.findAll({
            where: {
                m_userID : req.user.id
            },

        }).then((Envelope) =>{
            var totalNo = 0;
            for(i = 0; i < Envelope.length;i++)
            {
                let itemID = Envelope[i].itemID;
                let orderID = form.id;
                let m_userID = req.user.id;
                formList.create({
                    itemID,
                    orderID,
                    m_userID
                })
                Envelope[i].destroy(

                )
                
            }//res.redirect('/form/itemOrderList')
            res.render('form/sendForm', {
                id: Envelope // ttis should be the envolope id
            })
        })
        
        //res.redirect('/form/saveForm');
    }).catch(err => console.log(err))

});
router.get('/totheenvelope/:id', (req, res) =>{
    let mquantity = req.body.mquantity;
    console.log('come on let it work')

    var id = req.user.id;
    envelope.findOne({ where: {id : req.params.id}})  //. this should be the envolop id
         .then(Envelope =>{
             if(Envelope){
                 console.log('ffff')
                 console.log(req.body.mquantity)
                 let mquantity = (Envelope.mquantity)+1
                 Envelope.update({mquantity})
                 res.render('/form/itemOrderList', {});
                 //res.render('form/saveForm');
             }
             else{
                 Form.findOne({where: { id:req.params.id}})
                     .then((Envelope) =>{
                         console.log('wanna dieeeee')
                         let itemID = Envelope.id;
                         let m_userID = req.user.id;
                         let mquantity = 1;
                         formList.create({
                             itemID,
                             mquantity,
                             m_userID,
                         }).then((envelope) =>{
                             res.redirect('form/itemOrderList')
                             //res.render('form/saveForm');
                         })
                     })

             }
         } )
})
router.get('/toOrder/:envid', ensureAuthenticated,(req, res) => {
    var envelope_id = req.params.envid;
    // query formlist where envelope_id : envelop_id
    Form.findOne({ where:{envelope_id: envelop_id}})
      .then((Envelope) =>{
          let itemID =Envelope.id;
          let m_userID = req.user.id;
          let mquantity = 1;
          formList.create({
              itemID,
              mquantity,
              m_userID,
          }).then((envelope)=>{
              res.redirect('form/itemOrderList'),{
                form:'Order list',
                id :envelope_id
              }
          })
      })
    // res.render('form/itemOrderList'),{
    //     form:'Order list',
    //     id :envelope_id
    // }
})
router.get('/orderList', ensureAuthenticated, (req, res) => {
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
        res.render('form/itemOrderList', {
            forms: forms
        });
    }).catch(err => console.log(err));
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
            let merchant = form.merchant;
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
                merchant,
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
            let merchant =form.merchant;
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
                merchant,
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
    Form.findAll({ // select * from video where userid = ... and title like '%dark%';
        where : {
            userId: req.user.id,
            itemCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("itemName")), 'LIKE', '%' + query + '%')
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

router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    var dispatchId = req.params.id;
    Video.findOne({
        where: {
            id: dispatchId
        }
    }).then((form) => {
        console.log("dispatchIDToDelete.userId : " + form.userId);
        console.log("req.user.id : " + req.user.id);
        if (form.userId === req.user.id) {
            Form.destroy({
                where: {
                    id: dispatchId
                }
            }).then((form) => {
                // For icons to use, go to https://glyphsearch.com/
                alertMessage(res, 'success', 'Dispatch ID ' + dispatchId + ' successfully deleted.', 'fa fa-hand-peace-o', true);
                res.redirect('/form/itemOrderList');
            }).catch(err => console.log(err));
        } else {
            // Video does not belong to the current user
            alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
            req.logout();
            res.redirect('/');
        }
    })
});


// Shows edit video page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Form.findOne({
        where: {
            id: req.params.id
        }
    }).then((forms) => {

        if (req.user.id === forms.userId) {
            checkOptions(forms); 
            // call views/video/editVideo.handlebar to render the edit video page
            res.render('form/sendForm', {
                forms // passes video object to handlebar
            });
        } else {
            // Video does not belong to the current user
            alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
            req.logout();
            res.redirect('/');
        }
    }).catch(err => console.log(err)); // To catch no video ID
});
// Save edited video
router.put('/saveEditedOrder/:id', ensureAuthenticated, (req, res) => {
    let merchant = req.user.name;
    let itemName = req.body.itemName;
    let price = req.body.price;
    let itemCode = req.body.itemCode;
    let description = req.body.description.slice(0, 1999);
    let quantity = req.body.quantity;
    let referenceNo = req.body.referenceNo;
    let dateofDelivery = moment(req.body.dateofDelivery, 'DD/MM/YYYY');
    let userId = req.user.id;
    let posterURL = req.body.posterURL;
    // Retrieves edited values from req.body
    Form.update({
        // Set variables here to save to the videos table
        merchant,
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
    }, {
            where: {
                id: formID
            }
        }).then(() => {
            // After saving, redirect to router.get(/listVideos...) to retrieve all updated
            // videos
            res.redirect('/form/itemOrderList');
        }).catch(err => console.log(err));
});


// router.get('/ajaxForm', (req, res) => {
//     res.render('form/tryAjax', { // pass object to saveForm.handlebar
    
//     });
// });

module.exports = router;