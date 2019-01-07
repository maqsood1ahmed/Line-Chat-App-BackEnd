const mongoose = require('mongoose');

const lineBotMessagesSchema = mongoose.Schema({
    messageId: Number,
    userId: String,
    friendId: String,
    Message: String,
    direction: String,
    banned: Boolean
});


module.exports = mongoose.model('line_collection_Messages', lineBotMessagesSchema);