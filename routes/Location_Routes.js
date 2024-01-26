const location = require('../models/Driver_location');
const express = require('express');
const router = express.Router();


// http://localhost:5000/api/SchoolBus/updatelocation/location_driver
router.put('/location_driver', async (req, resp) => {
    const { BusNumber, LocationLat, LocationLong } = req.body;

    try {
        let updated = await location.updateOne({
            BusNumber:BusNumber
        },{
            $set:{
                LocationLat:LocationLat,
                LocationLong:LocationLong
            },
        },{
            upsert:true
        });
        

        return resp.status(400).json({
            success:true,
            msg:'location Updated'
        });
    } catch (error) {
        console.error("Error updating location:", error);
        resp.status(500).json({
            success: false,
            error: "Server error"
        });
    }
});



// http://localhost:5000/api/SchoolBus/updatelocation/location_driver

router.get('/location_driver',async(req,resp)=>{
    const {BusNumber} = req.body;
    let location_found = await location.findOne({BusNumber:BusNumber});
    if(!location_found){
        return resp.status(400).json({
            success:false,
            msg:'Location not found'
        });
    }

    return resp.status(200).json({
        success:true,
        LocationLat:location_found.LocationLat,
        LocationLong:location_found.LocationLong
        
    });
});


module.exports = router;