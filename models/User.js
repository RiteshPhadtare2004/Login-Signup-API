const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    rollNo:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        uniquw: true
    },
    password:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User',UserSchema);