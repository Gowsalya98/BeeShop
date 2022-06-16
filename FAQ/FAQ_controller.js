const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const {FAQ}=require('./FAQ_model')
const moment = require('moment')

const createFAQ=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        console.log('superAdminToken:',superAdminToken)
        if(superAdminToken!=null){
            req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
            console.log('line 12',req.body)
            const data=await FAQ.create(req.body)
            console.log('line 15',data)
                if(data!=null){
                    res.status(200).send({message:"created successfully",data:data})
                }else{
                    res.status(302).send({message:"unsuccessfully failed"})
                }
        }else{
            res.status(301).send({message:"unauthorized"})
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const getAll=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await FAQ.aggregate([{$match:{deleteFlag:false}}])
            if(data.length!=0){
                data.sort().reverse()
                res.status(200).send({message:"All FAQ",data:data})  
            }else{
                res.status(302).send({message:"Data not found"})
            }
        }else{
            res.status(301).send({message:"Unauthorized"})
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const updateFAQ=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            if(req.params.id.length==24){
                const datas=await FAQ.findOne({_id:req.params.id,deleteFlag:false})
                console.log('line 61',datas)
                if(datas!=null){
                    const data=await FAQ.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
                    if(data!=null){
                        res.status(200).send({message:"update successfully",data:data})
                    }else{
                        res.status(301).send({message:"data not found"})
                    }
                }else{
                    res.status(301).send({message:"data not found"})
                }
            }else{
                res.status(303).send({message:"please provide valid id"})
            }
        }else{
            res.status(302).send({message:"unauthorized"})
        }
    }catch(err){
      res.status(500).send({message:"internal server error"})
    }
}

const removeFAQ=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            if(req.params.id.length==24){
                const datas=await FAQ.findOne({_id:req.params.id,deleteFlag:false})
                console.log('line 80',datas)
                if(datas!=null){
                    const data=await FAQ.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:true}},{returnOriginal:false})
                    if(data!=null){
                        res.status(200).send({message:"Deleted successfully",data})
                    }else{
                        res.status(301).send({message:"Data not found"})
                    }
                }else{
                    res.status(302).send({message:"Data not found"})
                }
            }else{
                res.status(301).send({message:"Please provid the vaild id"})
            }
        }else{
            res.status(302).send({message:"Unauthorized"})
        }
    }catch(err){
        res.stat(500).send({message:'internal server errror'})
    }

}

module.exports={
    createFAQ,
    getAll,
    updateFAQ,
    removeFAQ
}

