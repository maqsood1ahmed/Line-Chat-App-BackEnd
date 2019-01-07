'use strict';

const line = require('@line/bot-sdk'); 
const bodyParser = require('body-parser');

//database configuration
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

const usersController = require('./app/controllers/users.controller.js');
const messagesController = require('./app/controllers/messages.controller.js');
const messagesModel = require('./app/models/line_bot_messages_model.js');
const userModel = require('./app/models/line_bot_users_model.js');

const cors = require('cors');

var webSocket;

mongoose.Promise = global.Promise;

var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
  };

mongoose.connect(dbConfig.url, options)
    .then(() => {
        console.log('Successfully connected to database.');
    })
    .catch(err => {
        console.log('Could not connect to database. Exiting now....');
        process.exit();
    });

const config = {
    channelSecret : '6b87507e0ec11839e6ffe0e6fd246197',
    channelAccessToken: '+HihIOIzWxrQTfKDnM4UgTqvvc0XQ2YOncFb4y208Cqvpb/s4C0kQI0gOKdBjKXcgVjZjM/sEblstd84cp0SEf9gnkzDYOZVlJP1tjzpeLJ7E5o4YiU6clqlWCp0v3ItTvvRBnafqhvXaiMrRcKiyAdB04t89/1O/w1cDnyilFU='
};

const client = new line.Client(config);


const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

io.on('connection', function(socket){
    console.log('A new WebSocket connection has been established');
    webSocket = socket;

    socket.on('client-message', (message) => {
        messagesModel.find().sort({messageId:-1}).limit(1)
        .then(data => {
            let newId = data[0].messageId + 1;
            const Message = new messagesModel({
                messageId: newId,
                userId: message.userId,
                friendId: message.currentFriend,
                Message: message.Message,
                direction: message.direction,        
                banned: message.banned
             });
            
            Message.save().then(()=> {    //add message to database
                console.log('Message saved to database-----------------------');
                client.pushMessage(message.currentFriend, 
                                        {type: 'text', text: message.Message})
            })
    })
  });
});



app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.text())

app.use(cors());


app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const echo = { type: 'text', text: event.message.text };

  const userId = event.source.userId;
  const profile = client.getProfile(userId);
  console.log(echo);
  
  profile.then(result => {
      let dataArray;

    userModel.find({"userId" : result.userId})
        .then(data => {
            const dataArray = data;

            if(typeof dataArray != "undefined" && dataArray != null && dataArray.length != null && dataArray.length > 0){
                console.log('user already exist', dataArray); //if user already a friend do here something
                
                messagesModel.find().sort({messageId:-1}).limit(1)
                    .then(data => {
                        console.log('--------------------------------',data[0].messageId, '----------------------------------');
                        let newId = data[0].messageId + 1;

                        let messageObj =    {
                            messageId: newId,
                            userId: 'myapp',
                            friendId: result.userId,
                            Message: event.message.text,
                            direction: 'from',        
                            banned: false
                        }                         

                        const Message = new messagesModel(messageObj);
                        
                        Message.save().then(()=> {    //add message to database
                            console.log('Message saved to database-----------------------');
                            webSocket.emit('server-message', messageObj)
                        })   
                        

                         

                         return null;
                    })
                    .catch(err => console.log('error occured.....', err.message));
            }
            else
                {
                    console.log('Adding New User to database...........'); // new friend add him or block him
                            //create a user
                    const user = new userModel({
                        userId        : result.userId,
                        idName        : result.displayName,
                        pictureUrl    : result.pictureUrl,
                        statusMessage : result.statusMessage
                    });

                    user.save().then(()=> {
                        console.log('user saved to database-----------------------');
                        webSocket.emit('server-user', user);
                    })
                    .catch(err => {
                        console.log('user not saved to database..........');
                    })
                    
                    let newId = 0;
                    let messageObj = {
                            messageId: newId,
                            userId: 'myapp',
                            friendId: result.userId,
                            Message: event.message.text,
                            direction: 'from',        
                            banned: false
                        }
                    const Message = new messagesModel(messageObj);
                    
                    Message.save().then(()=> {    //add message to database
                        console.log('Message saved to database-----------------------');
                        webSocket.emit('server-message', messageObj);
                    })   
                    
                    return null;
                 
            }
        })
        .catch(err => console.log('error occured.....', err.message));
  })
}


require('./app/routes/line_bot.routes.js')(app);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`))
