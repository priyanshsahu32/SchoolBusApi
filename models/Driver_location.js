const mongoose = require('mongoose');

const location = new mongoose.Schema({
    BusNumber:{
        type:String,
        required:true
    },
    LocationLat:{
        type:String
    },
    LocationLong:{
        type:String
    }
});


module.exports = mongoose.model('DriverLocation',location);