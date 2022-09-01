const { json } = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const EventSchema = new mongoose.Schema({
    name: String,
    artist: [
        {
            name: String,
            photo: String,
            followers: Number
        }
    ],
    discription: String,
    comments: [
        {
            text: String,
            posted: Date,
            user: String
        }
    ],
    likes: Number,
    type: String,
    date: Date,
    place: String,
    time: String,
    photo: String,
    registrationFee: Number
})

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean,

    sub: String,
    name: String,
    given_name: String,
    family_name: String,
    picture: String,
    email: String,
    email_verified: Boolean,
    locale: String,
    admin: Boolean
});

// const gUserSchema = new mongoose.Schema({
//     sub: String,
//     name: String,
//     given_name: String,
//     family_name: String,
//     picture: String,
//     email: String,
//     email_verified: Boolean,
//     locale: String,
//     admin: Boolean
// });


const User = connection.model('User', UserSchema, 'User');
const Event = connection.model('Event', EventSchema, 'Event');
// const gUser = connection.model('gUser', gUserSchema, 'gUser');


module.exports = connection;
