const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const formList = db.define('formList', {
     
    mquantity: {
        type: Sequelize.STRING
    },
    
}
);
module.exports = formList;