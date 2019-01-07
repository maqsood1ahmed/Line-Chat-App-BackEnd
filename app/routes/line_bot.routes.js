module.exports = (app) => {
    const userController = require('../controllers/users.controller.js');
    const messageController = require('../controllers/messages.controller.js');

    // //to create a users database
    // app.post('/users', lineBot.storeUser);

    //retrieve all users
    app.get('/users', userController.findAll);

    //retrieve messages for a single user
    app.get('/messages/:friendId', messageController.getMessagesByFriendId);
}
