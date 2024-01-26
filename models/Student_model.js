// const { default: mongoose } = require('mongoose');
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    StudentName:{
        type:String,
        require:true
    },
    StudentId:{
        type:String,
        require:true
    },
    StudentPassword:{
        type:String,
        require:true
    },
    Avatar:{
        type:String
    }
});

module.exports = mongoose.model('Student',StudentSchema);