const express = require('express');
const mongoose  = require('mongoose');
const app = express();
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.json({}));
app.use(express.json({
    extended:true
}));

dotenv.config({
    path:'./config/config.env'
});

connectDB();
// http://localhost:5000/api/SchoolBus/user_driver/
app.use('/api/SchoolBus/user_driver',require('./routes/Driver_Routes'));
// http://localhost:5000/api/SchoolBus/user_student
app.use('/api/SchoolBus/user_student',require('./routes/Student_Routes'));
// http://localhost:5000/api/SchoolBus/updatelocation
app.use('/api/SchoolBus/updatelocation',require('./routes/Location_Routes'));
const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log('running'));
