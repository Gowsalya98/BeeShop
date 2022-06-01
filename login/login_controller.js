const mongoose=require('mongoose')
const nodemailer=require('nodemailer')
const fast2sms=require('fast-two-sms')
const jwt=require('jsonwebtoken')
const moment=require('moment')
const {login,image,otpSchema}=require('./login_model')
const {randomString}=require('../middleware/randomString')

const loginForUser=async(req,res)=>{
    try {
        console.log(req.body);
        if(Object.keys(req.body).length===0){
            res.status(302).send({message:'please provide valid details'})
        }else{
            const data=await login.aggregate([{$match:{$or:[{email:req.body.email},{phoneNumber:req.body.phoneNumber},{GoogleId:req.body.GoogleId},{faceBookId:req.body.faceBookId}]}}])
            console.log('line 11',data)
            if(data.length!=0){
                        if (data[0].email!=null||data[0].PhoneNumber!=null) {
                                const otp = randomString(3)
                                console.log("otp", otp)
                              const data1=await otpSchema.create({otp: otp })
                                console.log("line 18", data1)
                                    if (data1) {
                                        const response = await fast2sms.sendMessage({authorization: process.env.OTPKEY,message:otp,numbers:[data[0].phoneNumber]})
                                        postMail(data[0].email,"BeeShop","verify otp:"+otp)
                                            const token = jwt.sign({ userid: data[0]._id }, 'secret')
                                             console.log("line 23",token)
                                                res.status(200).send({ message: "verification otp send your email",otp,token,data:data})
                                                    setTimeout(() => {
                                           otpSchema.findOneAndDelete({ otp: otp },{returnOriginal:false}, (err, result) => {
                                                if(result){
                                                console.log("line 28", result)
                                                }else{
                                                   res.status(400).send({message:'something error'})
                                                }
                                            })
                                        }, 300000000)
                                    }else{
                                        res.status(400).send({success:'false',message:'otp does not send'})
                                    }  
                        }else if(data[0].GoogleId!=0 ||data[0].faceBookId!=0){
                            if(data!=null){
                                const token = jwt.sign({ userid: data[0]._id }, 'secret')
                                console.log("line 39",token)
                                res.status(200).send({ success:'true',message: "login successfull",token,data:data})
                             } else{
                                res.status(400).send({ success:'false',message: "failed to login"})
                             }   
                        }else{
                            res.status(400).send({ success:'false',message: "failed"})
                            }        
            }else{
                console.log('line 48',req.body)
                req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                const data1=await login.create(req.body)
                    if(data1){
                        console.log('line 51',data1)
                        res.status(200).send({message:'create successfully',data1})
                    }else{res.status(400).send({message:'please provide valid email'})}
            }
        }
}catch (err) {
        console.log(err.message)
        res.status(500).send({ message: 'internal server error' })}
}
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nishagowsalya339@gmail.com',
        pass: '8760167075'
    }
})
const postMail = function ( to, subject, text) {
    return transport.sendMail({
        from: 'nishagowsalya339@gmail.com',
        to: to,
        subject: subject,
        text: text,
    })
}

const verificationOtp=async(req,res)=>{
    try{
        const data=await otpSchema.aggregate([{$match:{otp:req.body.otp}}])
       console.log('line 52',data)
       if(data.length!=0){
           res.status(200).send({success:'true',message:'login successfull',data})
       }else{
           res.status(400).send({success:'false',message:'invalid otp try it again',data:[]})
       }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const imageUpload=(req,res)=>{
    try{
            req.body.image=`http://192.168.0.112:9096/uploads/${req.file.originalname}`
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
        const data=await login.aggregate([{$match:{deleteFlag:false}}])
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
        const data=await login.aggregate([{$match:{$and:[{_id:new mongoose.Types.ObjectId(req.params.userId)},{deleteFlag:false}]}}])
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
          const data = await login.findOneAndUpdate({_id:req.params.userId,deleteFlag:false},{$set:req.body},{new:true})
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
            res.status(200).send({ message: "please provide a valid space id" });
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
              const data=await login.findOneAndUpdate({_id:req.params.userId},{deleteFlag:true},{new:true})
              if(data!=null){
                  res.status(200).send({success:'true',message:'delete successfully',data})
              }else{
                  res.status(400).send({success:'false', message:'something wrong please try it again'})
              }
          }else{
              res.status(400).send({success:'false',message:'please provide valid id'})
          }
        }else{
          res.status(400).send({success:'false',message:"unauthorized"})
        }
      }catch(err){
        console.log(err);
          res.status(500).send({message:'internal server error'})
      }
}
module.exports={loginForUser,verificationOtp,imageUpload,getAllUser,getById,updateUserDetails,deleteUserDetails}