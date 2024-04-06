const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const bcryptjs = require('bcryptjs');

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

const PORT = 4000;
const server = app.listen(PORT, () => {
    console.log(`app is listening on port number ${PORT}`)
});


/**
 * web socket code starts from here
 */
const wss = new ws.WebSocketServer({ server });
wss.on('connection', (connection) => {
    console.log(`web socket connected`);
});