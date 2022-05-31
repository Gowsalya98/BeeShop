const mongoose=require('mongoose')
const nodemailer=require('nodemailer')
const fast2sms=require('fast-two-sms')
const jwt=require('jsonwebtoken')
const {login,image,otpSchema}=require('./login_model')
const {randomString}=require('../middleware/randomString')

const loginForUser=async(req,res)=>{
    try {
        const data=await login.create(req.body)
    if(data){
        if (data.PhoneNumber!=null) {
           const datas=await login.aggregate([{$match:{email: req.body.email}}])
                if(datas){
                        const otp = randomString(3)
                        console.log("otp", otp)
                      const data1=await otpSchema.create({otp: otp })
                        console.log("line 17", data1)
                            if (data1) {
                                postMail(req.body.email,"BeeShop","verify otp:"+otp)
                              const token = jwt.sign({ userid: data._id }, 'secret')
                              console.log("line 22",token)
                              res.status(200).send({ message: "verification otp send your email",otp,token,data})
                                setTimeout(() => {
                                   otpSchema.findOneAndDelete({ otp: otp },{returnOriginal:false}, (err, result) => {
                                        if(err){throw err}
                                        console.log("line 27", result)
                                    })
                                }, 300000000)
                            }else{res.status(400).send({success:'false',message:'otp does not send'})}  
                }else{
                    res.status(400).send({success:"false",message:'please check your mail id'})
                 }   
        }else {
            console.log('line 35',req.body.PhoneNumber)
          const datas=await login.aggregate([{ $match:{PhoneNumber: req.body.PhoneNumber }}])
                if(datas){
                    if(datas.PhoneNumber==req.body.PhoneNumber){
                        const otp = randomString(3)
                            console.log("otp", otp)
                     const dataValue=await otpSchema.create({otp: otp })
                                console.log("line 42", dataValue)
                    if (dataValue) {
                                console.log("line 45", dataValue)
                                const token = jwt.sign({ userid: data._id }, 'secret')
                              console.log("line 46",token)
                        const response = await fast2sms.sendMessage({authorization: process.env.OTPKEY,message:otp,numbers:[req.body.phoneNumber]})
                        res.status(200).send({ message: "verification otp send your mobile number",otp,token,data})
                                    setTimeout(() => {
                                       otpSchema.findOneAndDelete({ otp: otp },{returnOriginal:false}, (err, result) => {
                                            if(err){throw err}
                                            console.log("line 51", result)
                                        })
                                    }, 30000000)
                    }else{res.status(302).send('otp does not send')}  
                    }else{res.status(302).send('contact does not match')}
                }else{
                    res.status(302).send({message:'please provide vaild phoneNumber'})
                }
            }
    }
}catch (err) {
        console.log(err.message)
        res.status(500).send({ message: 'internal server error' })
    }
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
           res.status(200).send({success:'true',message:'successfull',data})
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