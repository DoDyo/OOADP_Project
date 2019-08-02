const mySQLDB = require('./DBConfig');
const user = require('../models/M_User');
const form = require('../models/Form');
const envelope = require('../models/envelope')
const formList = require('../models/formList')
// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('form database connected');
        })
        .then(() => {
            /*
            Defines the relationship where a user has many forms.
            In this case the primary key from user will be a foreign key
            in form.
            */
            user.hasMany(form);
            user.hasMany(envelope, {
                foreignKey : 'm_userID'
            });

          
                
            envelope.belongsTo(user,{
                foreignKey: 'm_userID'
            });
            formList.belongsTo(user, { foreignKey: 'm_userID' });
            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};
module.exports = { setUpDB };