const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver_model');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_jwt = require('../middleware/user_jwt');

const {token} = require('morgan');



router.get('/register_driver',user_jwt,async (req,resp,next)=>{
    try {
        const user = await Driver.findById(req.user.id).select('-DriverPassword');
            resp.status(200).json({
                success:true,
                user:user
            });
    } catch (error) {
        console.log(error.message);
        next();
    }
});


// http://localhost:5000/api/SchoolBus/updatelocation/register_driver

router.post('/register_driver',async(req,resp,next)=>{
    const {DriverName,DriverEmail,DriverPassword,BusNumber} = req.body;
try{
    let Driver_exist = await Driver.findOne({DriverEmail,DriverEmail});
    let bus_exist = await Driver.findOne({BusNumber,BusNumber});

    if(Driver_exist){
        return resp.status(400).json({
            msg:'Driver already exist',
            success:false
        });
    }

    else if(bus_exist){
        return resp.status(400).json({
            msg:'Bus is already alloted to someone',
            success:false
        })
    }
    let new_driver = new Driver();
    new_driver.DriverName = DriverName;
    new_driver.DriverEmail = DriverEmail;
    
    const salt = await bcryptjs.genSalt(10);
    new_driver.DriverPassword = await bcryptjs.hash(DriverPassword,salt);

    new_driver.BusNumber = BusNumber;
    new_driver.Avatar = "https://gravatar.com/avatar/?s="+200+'&d=retro';

    await new_driver.save();

    const payload = {
        new_driver:{
            id:new_driver.id
        }
    }

    jwt.sign(payload,process.env.jwtUserSecret,{
        expiresIn:360000
    },(err,token)=>{
        if(err) throw err;

        resp.status(200).json({
            success:true,
            token:token
        });
        

    });

} catch(error){
    console.log(error);
}


});

// http://localhost:3000/api/SchoolBus/user_driver/register_driver

router.delete('/register_driver',async(req,resp,next)=>{
    const {DriverEmail,DriverPassword} = req.body;
    try{
        let user = await Driver.findOne({DriverEmail,DriverEmail});
        if(!user){
            return resp.status(400).json({
                success:false,
                msg:'Driver not found! recheck Drivers Id'
            });
        }
        const password = await bcryptjs.compare(DriverPassword,user.DriverPassword);

        if(!password){
            return resp.status(400).json({
                success:false,
                msg:'Wrong Password'
            });
        }

        let response = await Driver.deleteOne({DriverEmail:DriverEmail});
        if(response){
            return resp.status(200).json({
                success:true,
                msg:'Driver deleted Successfully'
            });
        }
    }catch(err){
        console.log(err);
    }
});
// http://localhost:5000/api/SchoolBus/user_driver/login_driver
router.post('/login_driver',async(req,resp,next)=>{
    const {DriverEmail,DriverPassword} = req.body;
    // console.log(DriverEmail);
    try{
        const driver_found = await Driver.findOne({DriverEmail:DriverEmail});
        if(!driver_found){
            return resp.status(400).json({
                success:false,
                msg:'this id is not registered! contact school administrator'
            });
        }

        const ismatch = await bcryptjs.compare(DriverPassword,driver_found.DriverPassword);
        if(!ismatch){
            return resp.status(400).json({
                success:false,
                msg:'Wrong Password'
            });
        }


        const payload = {
            driver_found:{
                id:driver_found.id
            }
        }

        jwt.sign(payload,process.env.jwtUserSecret,{
            expiresIn:36000000
        },(err,token)=>{
            if(err) throw err;

            return resp.status(200).json({
                success:true,
                msg:'Driver logged In Successfully',
                User:driver_found,
                token:token


            });
        });
    }catch(err){
        return resp.status(500).json({
            success:false,
            msg:'server error'
        });

    }
});




module.exports = router;