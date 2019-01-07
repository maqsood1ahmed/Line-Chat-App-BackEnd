const mongoose = require('mongoose');

const lineBotUsersSchema = mongoose.Schema({
    userId  : String,
    idName    : String,
    pictureUrl    : String,
    statusMessage: String
});


module.exports = mongoose.model('line_collection_users', lineBotUsersSchema)