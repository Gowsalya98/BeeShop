const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const moment=require('moment')
const {product}=require('./product_model')
const { validationResult } = require('express-validator')
const { register } = require('../user/user_model')

const addProductDetails=async(req,res)=>{
    try{
        const errors=validationResult(req)
        if(errors.isEmpty()){
            return res.status(302).send({errors:errors.array()})
        }else{
            console.log(req.headers.authorization)
            const userToken=jwt.decode(req.headers.authorization)
            console.log('line 15',userToken)
            req.body.productOwnerId=userToken.userId
            const data=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(userToken.userId)},{deleteFlag:false}]}}])
                if(data!=null){
                    console.log('line 18',data)
                    var user={}
                    user.userName=data[0].userName,
                    user.email=data[0].email,
                    user.phoneNumber=data[0].phoneNumber,
                    user.profileImage=data[0].profileImage
                    req.body.userDetails=user

                    req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                   const result=await product.create(req.body)
                   if(result!=null){
                        res.status(200).send({success:'true',message:'add product successfully',result})
                   }else{
                       res.status(302).send({success:'false',message:'failed to add product details'})
                   }
                }else{
                    res.status(302).send({success:'false',message:'unauthorized'})
                }
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}

const ownerGetOurOwnProductDetails=async(req,res)=>{
    try{
        const productOwnerToken=jwt.decode(req.headers.authorization)
        if(productOwnerToken!=null){
            const data=await product.aggregate([{$match:{$and:[{productOwnerId:productOwnerToken.userId},{deleteFlag:false}]}}])
            if(data!=null){
                data.sort().reverse()
                res.status(200).send({success:'true',message:'your own product details',data:data})
            }else{
                res.status(400).send({success:'false',message:'failed to get data',data:[]})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})  
    }
}
const getAll=async(req,res)=>{
    try{
        const adminToken=jwt.decode(req.headers.authorization)
        if(adminToken!=null){
            const data=await product.aggregate([{$match:{deleteFlag:false}}])
                if(data!=null){
                    data.sort().reverse()
                    res.status(200).send({success:'true',message:'All product list',data:data})
                }else{
                    res.status(302).send({success:'false',message:'data not found',data:[]})
                }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

const getById=async(req,res)=>{
    try{
        if(req.params.productId.length==24){
            const data=await product.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.productId)},{deleteFlag:false}]}}])
                if(data!=null){
                    res.status(200).send({success:'true',message:'your data',data:data})
                }else{
                    res.status(302).send({success:'false',message:'data not found',data:[]})
                }
        }else{
            res.status(302).send({success:'false',message:'invalid product id'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

const updateProduct=async(req,res)=>{
    try{
        const productOwnerToken=jwt.decode(req.headers.authorization)
        if(productOwnerToken!=null){
            if(req.params.productId.length==24){
            const datas=await product.findOne({_id:req.params.productId},{deleteFlag:false})
            if(datas!=null){
                const data=await product.findOneAndUpdate({_id:req.params.productId},req.body,{new:true})
                if(data){
                    res.status(200).send({success:'true',message:'successfully update product details',data:data})
                }else{
                    res.status(302).send({success:'false',message:'failed to update details'})
                }
            }else{
                res.status(302).send({success:'false',message:'data not found'})
            }
        }else{
            res.status(302).send({success:'false',message:'invalid  product id'})  
        }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        } 
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

const deleteProduct=async(req,res)=>{
    try{
        const productOwnerToken=jwt.decode(req.headers.authorization)
        if(productOwnerToken!=null){
            if(req.params.productId.length==24){
            const datas=await product.findOne({_id:req.params.productId},{deleteFlag:false})
            if(datas!=null){
                const data=await product.findOneAndUpdate({_id:req.params.productId},{$set:{deleteFlag:true}},{returnOriginal:false})
                if(data){
                    res.status(200).send({success:'true',message:'successfully delete product details',data:data})
                }else{
                    res.status(302).send({success:'false',message:'failed to delete your account'})
                }
            }else{
                res.status(302).send({success:'false',message:'data not found'})
            }
        }else{
            res.status(302).send({success:'false',message:'invalid  product id'})  
        }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    addProductDetails,
    ownerGetOurOwnProductDetails,
    getAll,
    getById,
    updateProduct,
    deleteProduct
}