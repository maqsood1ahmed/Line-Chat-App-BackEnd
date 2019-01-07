const userModel = require('../models/line_bot_users_model.js');


// // Create and Save a new user
// exports.storeUser = (userData) => {
//     // const user1 = JSON.parse(req.body);

//     //create a user
//     const user = new userModel({
//         userId        : userData.userId,
//         idName        : userData.displayName,
//         pictureUrl    : userData.pictureUrl,
//         statusMessage : userData.statusMessage
//     });

//     user.save().then(()=> {
//         console.log('user saved to database-----------------------');
//     })
//         .catch(err => {
//             console.log('user not saved to database..........');
//         })
// };

// // Find a single user with a userId
// exports.findOne = (userId) => {
//     userModel.find({"userId" : userId})
//         .then(data => {
//             console.log('---------------------------',data[0],'-------------------------------')
//             return data[0];
//         })
//         .catch(err => console.log('error occured.....', err.message));
// };

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {

    userModel.find()
        .then(data => {
            res.json(data)
        })
        .catch(err => res.json(err))
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified userId in the request
exports.delete = (req, res) => {

};







