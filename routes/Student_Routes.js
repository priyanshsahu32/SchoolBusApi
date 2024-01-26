const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Student = require('../models/Student_model');

const bcryptjs = require('bcryptjs');
const user_jwt = require('../middleware/user_jwt');

const jwt = require('jsonwebtoken');
const { token } = require('morgan');



router.get('/register_student',user_jwt,async (req,resp,next)=>{
    try {
        const user = await Student.findById(req.user.id).select('-StudentPassword');
            resp.status(200).json({
                success:true,
                user:user
            });
    } catch (error) {
        console.log(error.message);
        next();
    }
});

// http://localhost:5000/api/SchoolBus/user_student/register_student
router.post('/register_student',async(req,resp,next)=>{

    const {StudentName,StudentId,StudentPassword} = req.body;
    try{
        let student_exist = await Student.findOne({StudentId,StudentId});

        if(student_exist){
            return resp.status(400).json({
                success:false,
                msg:'Student is already registered'
            });
        }

        let student = new Student();
        student.StudentName = StudentName;
        student.StudentId = StudentId;

        const salt = await bcryptjs.genSalt(10);
        student.StudentPassword = await bcryptjs.hash(StudentPassword,salt);
        student.Avatar = "https://gravatar.com/avatar/?s="+200+"&d=retro";

        await student.save();

        const payload = {
            student:{
                id:student.id
            }
        }


        jwt.sign(payload,process.env.jwtUserSecret,{
            expiresIn:360000
        },(err,token)=>{
            if(err){
                throw err;
            }

            resp.status(200).json({
                success:true,
                token:token
            });
        });
        

        



    }catch(err){
        console.log(err);
    }



});
// http://localhost:5000/api/SchoolBus/user_student/register_student
router.delete('/register_student',async(req,resp)=>{

    const {StudentId} = req.body;
    try{
        let student_exist = await Student.findOne({StudentId:StudentId});
        if(!student_exist){

            return resp.status(400).json({
                success:false,
                msg:'Student not found ! recheck student id'
            });
            
        }

        let response = await Student.deleteOne({StudentId:StudentId});
        if(response){
            return resp.status(200).json({
                success:true,
                msg:'Student is successfully removed from database'
            });
        }

        return resp.status(500).json({
            success:false,
            msg:'Error,student not removed'
        });

        



    }catch(err){
        console.log(err);
    }


});
// http://localhost:5000/api/SchoolBus/user_student/login_student
router.post('/login_student',async(req,resp,next)=>{
    const {StudentId,StudentPassword} = req.body;
    try{
        let student_found = await Student.findOne({StudentId,StudentId});
        if(!student_found){
            return resp.status(400).json({
                success:false,
                msg:'Student not registered ! recheck id or contact School'
            });
        }

        const correct_password = await bcryptjs.compare(StudentPassword,student_found.StudentPassword);
        if(!correct_password){
            return resp.status(200).json({
                
                success:false,
                msg:'! WRONG PASSWORD !'
               
            });
        }

        const payload = {
            student_found:{
                id:student_found.id
            }
        }

        jwt.sign(payload,process.env.jwtUserSecret,{
            expiresIn:360000
        },(err,token)=>{
            if(err) throw err;
            
            return resp.status(200).json({
                sucess:true,
                token:token,
                Student:student_found
            });
        });
    }catch(err){
        return resp.status(500).json({
            success:false,
            msg:'Server error'
        });
    }
});


module.exports = router;

