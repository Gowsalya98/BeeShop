const mongoose=require('mongoose')
const nodemailer=require('nodemailer')
const fast2sms=require('fast-two-sms')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const moment=require('moment')
const {register,image,otpSchema}=require('./user_model')
const {randomString}=require('../middleware/randomString')
const { validationResult } = require('express-validator')

const userRegister=async(req,res)=>{
    try{
        const errors =validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()})
        }else{
            console.log('line 17',req.body)
            const num=await register.countDocuments({phoneNumber:parseInt(req.body.phoneNumber)})
            console.log('line 19',num)
            if(num==0){
                req.body.password=await bcrypt.hash(req.body.password,10)
                req.body.repeatPassword=await bcrypt.hash(req.body.repeatPassword,10)
                req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                    const data=await register.create(req.body)
                if(data!=null){
                    console.log('line 26',data)
                    res.status(200).send({success:'true',message:'register successfully',data:data})
                }else{
                    res.status(400).send({success:'false',message:'failed to register'})
                }
            }else{
                res.status(302).send({success:'false',message:'your phoneNumber already exist'})
            }
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const login=async(req,res)=>{
    try{
        if(Object.keys(req.body).length===0){
            res.status(302).send({message:'please provide valid details'})
        }else{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(302).send({errors:errors.array()})
        }else{
            console.log('line 45',req.body)
            console.log('line 49',parseInt(req.body.phoneNumber))
            const data=await register.aggregate([{$match:{phoneNumber:parseInt(req.body.phoneNumber)}}])
            if(data.length!=0){
                console.log('line 52',data[0])
                const verifyPassword=await bcrypt.compare(req.body.password,data[0].password)
                if(verifyPassword==true){
                    const token=jwt.sign({userId:data[0]._id},'SecretKey')
                    res.status(200).send({success:'true',message:'login successfully',token,data:data})
                }else{
                    res.status(302).send({success:'false',message:'password mismatch'})
                }
            }else{
                res.status(400).send({success:'false',message:'please register here...!'})
            }
        }
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}

const forgetPassword=async(req,res)=>{
    try{
        if (req.body.otp != null) {
            otpSchema.findOne({ otp: req.body.otp }, async (err, result) => {
                console.log("line 68", result)
                if (result!=null) {
                    register.findOne({phoneNumber:req.body.phoneNumber,deleteFlag:false }, async (err, data) => {
                        console.log("line 71", data)
                        if (data!=null) {
                            if (req.body.phoneNumber==data.phoneNumber) {
                                console.log("line 74", data.phoneNumber)

                                if (req.body.newPassword == req.body.confirmPassword) {
                                    console.log("line 77", req.body.newPassword)
                                    console.log("line 78", req.body.confirmPassword)

                                    req.body.newPassword = await bcrypt.hash(req.body.newPassword, 10)
                                    register.findOneAndUpdate({phoneNumber:req.body.phoneNumber}, { $set:{password: req.body.newPassword} },{new:true}, (err, datas) => {
                                        if (err) { res.status(400).send({message:'unsuccessfull'})}
                                        else {
                                            console.log('line 84',datas);
                                            res.status(200).send({ message: "Reset Password Successfully", datas })
                                        }
                                    })
                                } else { res.status(400).send({ message: 'password does not match' }) }
                            } else { res.status(400).send({ message: 'phoneNumber does not match ' }) }
                        }else{
                            res.status(302).send({message:'invalid phone number'})
                        }
                    })
                } else { res.status(400).send({ message: 'invalid otp' }) }
            })
        } else {
            const data=await register.aggregate([{$match:{$and:[{phoneNumber:parseInt(req.body.phoneNumber)},{deleteFlag:false}]}}])
                console.log("line 99", data)
                if (data[0]!=null) {
                    console.log('line 101',data[0].PhoneNumber);
                    if (req.body.phoneNumber == data[0].phoneNumber) {
                        const otp = randomString(3)
                        console.log("otp", otp)
                        req.body.userDetails=data
                       otpSchema.create({ otp: otp,userDetails:req.body.userDetails},async(err, result) => {
                            console.log("line 107", result)
                            if (result) {
                                console.log("line 109", result)
                               // postMail(req.body.email, 'otp for changing password', otp)
                                const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[data.phoneNumber]})
                                res.status(200).send({ message: "verification otp send your mobile number",result})
                                setTimeout(() => {
                                    otpSchema.findOneAndDelete({ otp: otp }, (err, datas) => {
                                        console.log("line 115", datas)
                                        if (err) { throw err }
                                    })
                                }, 2000000)
                            }else{
                                res.status(302).send({message:'does not create otp'})
                            }
                        })
                    } else { res.status(302).send({ message: 'phoneNumber does not match' }) }
                }else{
                    res.status(302).send({success:'false',message:'please check your phone number'})
                }
            }
    }catch(err){
        console.log(err)
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const socialMediaLogin=async(req,res)=>{
    try {
        console.log(req.body);
        if(Object.keys(req.body).length===0){
            res.status(302).send({message:'please provide valid details'})
        }else{
            const data=await register.aggregate([{$match:{$or:[{GoogleId:req.body.GoogleId},{faceBookId:req.body.faceBookId}]}}])
            console.log('line 147',data)
            if(data.length!=0){
                if(data[0].GoogleId!=0 ||data[0].faceBookId!=0){
                    if(data!=null){
                        const token = jwt.sign({ userId: data[0]._id }, 'secret')
                        console.log("line 156",token)
                        res.status(200).send({ success:'true',message: "login successfull",token,data:data})
                    }else{
                        res.status(400).send({ success:'false',message: "failed to login"})
                    }   
                }else{
                     res.status(400).send({ success:'false',message: "invalid"})
                }        
            }else{
                console.log('line 165',req.body)
                req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                const data1=await register.create(req.body)
                    if(data1){
                        console.log('line 169',data1)
                        res.status(200).send({message:'create successfully',data1})
                    }else{
                        res.status(400).send({message:'does not create'})
                    }
            }
    }
}catch (err) {
        console.log(err.message)
        res.status(500).send({ message: 'internal server error' })}
}

const imageUpload=(req,res)=>{
    try{
            req.body.image=`http://192.168.0.112:9096/uploads/${req.file.filename}`
            req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
            image.create(req.body,async(err,data)=>{
              if(err){
                res.status(400).send({success:'false',message:'failed'})
              }else{
                res.status(200).send({success:'true',message:'image upload successfully',data})
              }
            })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getAllUser=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
        const data=await register.aggregate([{$match:{deleteFlag:false}}])
        console.log('line 117',data)
        if(data){
            data.sort().reverse()
            res.status(200).send({success:'true',message:'All user list',data:data})
        }else{
            res.status(302).send({message:'data not found',data:[]})
        }
    }else{
        res.status(400).send({message:'unauthorized'})
    }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getById=async(req,res)=>{
    try{
        if(req.params.userId.length==24){
        const data=await register.aggregate([{$match:{$and:[{_id:new mongoose.Types.ObjectId(req.params.userId)},{deleteFlag:false}]}}])
            if(data){
                res.status(200).send({success:'true',message:'your data',data:data})
            }else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
    }else{
            res.status(400).send({message:'please provide valid id'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const updateUserDetails=async(req,res)=>{
    try{
        if(req.headers.authorization){
          if (req.params.userId.length == 24) {
          const data = await register.findOneAndUpdate({_id:req.params.userId,deleteFlag:false},{$set:req.body},{new:true})
            if (data!=null) {
              const token=await jwt.decode(req.headers.authorization)
              if(token){
                  res.status(200).send({ success:'true',message:'upadate successfully',data: data });
              }else{
                res.status(200).send({ success:'false',message:'invalid token ',data: [] });
              }       
            } else {
              res.status(302).send({ success:'false',data: [] });
            }
          } else {
            res.status(200).send({ message: "please provide a valid user id" });
          }
        }else{
          res.status(400).send({ message: "unauthorized" });
        }
      }catch(err){
          console.log(err);
        res.status(500).send("internal server error")
      }
}
const deleteUserDetails=async(req,res)=>{
    try{
        if(req.headers.authorization){
          if(req.params.userId.length==24){
              const data=await register.findOneAndUpdate({_id:req.params.userId},{deleteFlag:true},{new:true})
              if(data!=null){
                  res.status(200).send({success:'true',message:'delete successfully',data})
              }else{
                  res.status(400).send({success:'false', message:'something wrong please try it again'})
              }
          }else{
              res.status(400).send({success:'false',message:'please provide valid user id'})
          }
        }else{
          res.status(400).send({success:'false',message:"unauthorized"})
        }
      }catch(err){
        console.log(err);
          res.status(500).send({message:'internal server error'})
      }
}
module.exports={
    userRegister,
    login,
    socialMediaLogin,
    forgetPassword,
    imageUpload,
    getAllUser,
    getById,
    updateUserDetails,
    deleteUserDetails
}