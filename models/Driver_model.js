const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    DriverName:{
        type:String,
        require:true
    },
    DriverEmail:{
        type:String,
        require:true
    },
    DriverPassword:{
        type:String,
        require:true
    },
    BusNumber:{
        type:String,
        require:true
    },
    Avatar:{
        type:String
    }
});


module.exports = mongoose.model('Driver',DriverSchema);