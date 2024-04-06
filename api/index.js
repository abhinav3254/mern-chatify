const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');

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

app.get('/test', (req, res) => {
    res.json('test-ok');
});


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const createdUser = await User.create({ username, password });
        // setting up jwt with paylod , secret and callback function
        jwt.sign({ userId: createdUser._id }, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).status(201).json({
                _id: createdUser._id,
            });
        });
    } catch (err) {
        if (err) throw err;
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`app is listening on port number ${PORT}`)
});