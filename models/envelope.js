const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const envelope = db.define('envelope', {
  
    quantity: {
        type: Sequelize.STRING
    },
    // itemID: {
    //     type: Sequelize.STRING
    // },
}
);
module.exports = envelope;