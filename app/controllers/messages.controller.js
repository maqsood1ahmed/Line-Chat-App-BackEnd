const messagesModel = require('../models/line_bot_messages_model.js');

// Retrieve and return all messages for a single user
exports.getMessagesByFriendId = (req, res) => {
    messagesModel.find({"friendId": req.params.friendId})
        .then(data => {
            res.json(data);
        })
        .catch(err => res.json(err));
    
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified userId in the request
exports.delete = (req, res) => {

};























/*
exports.storeMessage = (messageData) => {

    const Message = new messagesModel({
            messageId: 3,
            userId: '11',
            friendId: '12',
            Message: 'hello',
            direction: 'to',
            banned: false
    });

    Message.save().then(()=> {
        console.log('Message saved to database-----------------------');
    })
        .catch(err => {
            console.log('Message not saved to database..........');
        })
};

// Find last message id
exports.findOne = () => {
    messagesModel.find().sort({messageId:-1}).limit(1)
        .then(data => {
            return data[0].messageId;
        })
        .catch(err => console.log('error occured.....', err.message));
};
*/