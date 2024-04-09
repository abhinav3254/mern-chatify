const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

// web socket
const ws = require('ws')

// config dotenv file
dotenv.config();
// console.log(process.env.MONGO_URL);
jwtSecret = process.env.JWT_SECRET;


// connecting to the database
mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

app.use(express.json())
// adding parser for cookies so that we can read cookies
app.use(cookieParser());

app.get('/test', (req, res) => {
    res.json('test-ok');
});


/**
 * This route returns the profile details of the user
 */
app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            const { id, username } = userData;
            res.json(userData);
        });
    } else {
        res.status(401).json('no token');
    }

});

/**
 * This route will fetch all the users either they are online or offline
 */
app.get('/pepole', async (req, res) => {
    // here we are basically not passing any condition in {}
    // but in second that is projection we are passing that we want
    // _id and username and 1 means true
    const users = await User.find({}, { '_id': 1, username: 1 });
    res.json(users);
});


/**
 * This route let the user to register
 */
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({ username: username, password: hashedPassword });
        // setting up jwt with paylod , secret and callback function
        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
            });
        });
    } catch (err) {
        if (err) throw err;
    }
});


/**
 * route for login
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (passOk) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
                res.cookie('token', token, { sameSite: 'none', secure: true }).json({
                    id: foundUser._id
                });
            });
        }
    }

});

/**
 * route for logout
 */
app.post('/logout', (req, res) => {
    res.cookie('token', '', { sameSite: 'none', secure: true }).json('ok');
});


/**
 * This is a common method that we creating to fetch the current logged in user id.
 * @returns userData if there is token in cookie else returns a string message stating that no token was found in cookie 
 */
async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                const { id, username } = userData;
                resolve(userData);
            });
        } else {
            reject('no token');
        }
    });
}


/**
 * This route will send the chat history of selected user and currenlty logged in user
 */
app.get('/messages/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        // getting our userid from the token
        const userData = await getUserDataFromRequest(req);
        const ourUserId = userData.userId;
        // writing the query for mongodb where we are telling that either we can be sender or other person will be the user and vice versa and fetching all of the details

        // console.log(userId + ' and rec' + ourUserId);
        const messages = await Message.find({
            sender: { $in: [userId, ourUserId] },
            recipient: { $in: [userId, ourUserId] },
        }).sort({ createdAt: 1 });
        // sorting by createdAt by asc
        // responding back with the messages json
        res.json(messages);
    } catch (err) {
        console.error(err);
    }
});

const PORT = 4000;
const server = app.listen(PORT, () => {
    console.log(`app is listening on port number ${PORT}`)
});


/**
 * web socket code starts from here
 */
const wss = new ws.WebSocketServer({ server });

/**
 * This method get called when someone is connected to the websocket
 */
wss.on('connection', (connection, req) => {

    function notifyAboutOnlinePeople() {
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                ononline: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
            }));
        })
    }

    connection.isAlive = true;

    /**
     * here what was happening when logout is clicked is that 
     * it starts to reconnect automatically
     * so for this we have used clearInterval();
     */
    connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyAboutOnlinePeople();
        }, 1000);
    }, 5000);

    connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
    });

    // read username and id from the cookie for this connection
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
                    if (err) throw err;
                    const { userId, username } = userData;
                    connection.userId = userId;
                    connection.username = username;
                })
            }
        }
    }


    // sending message code is written here
    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;
        if (recipient && text) {
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
            });
            [...wss.clients]
                .filter(c => c.userId === recipient)
                .forEach(c => c.send(JSON.stringify({
                    text,
                    sender: connection.userId,
                    recipient,
                    _id: messageDoc._id,
                })))
        }
    });

    // here we are two clients because when we run react app in development mode
    // it renders each component two times so that's the reason we have two clients
    // console.log([...wss.clients].length);
    // getting all the usernames which are online now
    // console.log([...wss.clients].map(e => connection.username));

    // notify everyone about online pepole (when someone connects)
    notifyAboutOnlinePeople();

});
