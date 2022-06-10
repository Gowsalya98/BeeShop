const {superAdmin,package} = require('./super_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment=require('moment')
const { validationResult } = require('express-validator')

const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        } else {
         const data=await superAdmin.countDocuments({email: req.body.email })
         console.log('line 13',data)
        if (data == 0) {
        req.body.password = await bcrypt.hashSync(req.body.password, 10)
        req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
         const datas=await superAdmin.create(req.body)
         if(datas){
            res.status(200).send({ message: "Successfully Registered", data:datas })
         } else {
            res.status(302).send({ message: "failed to register",data:[] })
         }
        }else{
            res.status(400).send({ message: "This Email already Exists" })
        }
    }
    } catch (err) {
        res.status(500).send({ success:'false',message:'internal server error' })
    }
}

const login = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        } else {
            superAdmin.findOne({ email: req.body.email }, async (err, data) => {
              if(data){
                  console.log('line 40',data);
                  const password=await bcrypt.compare(req.body.password,data.password)
                    if (password == true) {
                        const userId = data._id
                        const token = jwt.sign({ userId }, 'secretKey')
                        console.log('line 45',data)
                        res.status(200).send({ message: "Login Successfully", token,data })
                    } else {
                        res.status(400).send({ message: "Incorrect Password" })
                    }
                }else{
                    res.status(400).send({ message: "invalid email & password" })
                }

            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ success:'false',message:'internal server error'})
    }
}
const createPackageForSuperAdmin=async (req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await package.create(req.body)
            if(data!=null){
                res.status(200).send({success:'true',message:'create package successfull',data})
            }else{
                res.status(400).send({success:'false',message:'failed to create package'})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getAllPackage=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
        const data=await package.aggregate([{$match:{deleteFlag:false}}])
        if(data!=null){
            res.status(200).send({success:'true',message:'All package details',data:data})
        }else{
            res.status(302).send({success:'false',message:'data not found'})
        }
    }else{
        res.status(302).send({success:'false',message:'unauthorized'})
    }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
const updatePackage=async(req,res)=>{
    try{
        if(req.params.packageId.length==24){
            const datas=await package.findOne({_id:req.params.packageId,deleteFlag:false})
            if(datas!=null){
            const data=await package.findOneAndUpdate({_id:req.params.packageId},req.body,{new:true})
            if(data!=null){
                res.status(200).send({success:'true',message:'update data successfully',data:data})
            }else{
                res.status(302).send({success:'false',message:'does not delete data'})
            }
        }else{
            res.status(302).send({success:'false',message:'your data already deleted'})
        }
    }else{
        res.status(400).send({success:'false',message:'invalid id'})
    }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
const deletePackage=async(req,res)=>{
    try{
        if(req.params.packageId.length==24){
            const data=await package.findOneAndUpdate({_id:req.params.packageId},{$set:{deleteFlag:true}},{returnOriginal:false})
            if(data!=null){
                res.status(200).send({success:'true',message:'delete data successfully',data:data})
            }else{
                res.status(302).send({success:'false',message:'does not delete data'})
            }
        }else{
            res.status(400).send({success:'false',message:'invalid id'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    register,
    login,
    createPackageForSuperAdmin,
    getAllPackage,
    updatePackage,
    deletePackage
}
