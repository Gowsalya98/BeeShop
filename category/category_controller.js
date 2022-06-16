const {category}=require('./category_model')
const {validationResult}=require('express-validator')
const mongoose=require('mongoose')
const moment=require('moment')
const jwt = require("jsonwebtoken");

const addCategory=async(req,res)=>{
    try{
      console.log('line 8',req.body)
        if(req.headers.authorization){
            const token=await jwt.decode(req.headers.authorization)
            req.body.superAdminId=token.userId
            console.log('line 12',req.body.superAdminId)
            req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
            category.create(req.body,(err,data)=>{
                if(err){
                    res.status(400).send({success:'false',message:'failed'})
                }else{
                    if(data!=null){
                      console.log('line 18',data)
                        res.status(200).send({success:'true',message:'create successfully',data})
                    }else{
                      res.status(302).send({success:'false',message:'failed',data:[]})
                    }
                }
            })
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

const getAllCategory=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
       const data=await category.aggregate([{$match:{deleteFlag:false}}])
       if(data){
            data.sort().reverse()
            res.status(200).send({Success:'true',message:'All category details',data})
       }else{
        res.status(302).send({uccess:'false',message:'failed',data:[]})
       }
    }else{
        res.status(302).send({success:'false',message:'unauthorized'})
    }
    }catch(err){
        
    }
}
const getById=async(req,res)=>{
    try{
        if(req.params.categoryId.length==24){
            const data=await category.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.categoryId)},{"deleteFlag":false}]}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'your data' ,data: data });
            } else {
              res.status(302).send({success:'false',message:'failed', data: [] });
            }
          } else {
            res.status(302).send({ message: "please provide a valid id" });
          }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const updateCategory=async(req,res)=>{
    try{
              if(req.headers.authorization){
                if (req.params.categoryId.length == 24) {
                const data = await category.findOneAndUpdate({_id:req.params.categoryId,deleteFlag:false},{$set:req.body},{new:true})
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
                  res.status(200).send({ message: "please provide a valid category id" });
                }
              }else{
                res.status(302).send({ message: "unauthorized" });
              }
            }catch(err){
                console.log(err);
              res.status(500).send("internal server error")
            }
          }

const deleteCategory=async(req,res)=>{
    try{
      if(req.headers.authorization){
        if(req.params.categoryId.length==24){
            const data=await category.findOneAndUpdate({_id:req.params.categoryId},{deleteFlag:true},{new:true})
            if(data!=null){
                res.status(200).send({success:'true',message:'delete successfully',data})
            }else{
                res.status(302).send({success:'false', message:'something wrong please try it again'})
            }
        }else{
            res.status(302).send({success:'false',message:'please provide valid id'})
        }
      }else{
        res.status(302).send({success:'false',message:"unauthorized"})
      }
    }catch(err){
      console.log(err);
        res.status(500).send({message:'internal server error'})
    }
}

module.exports={
  addCategory,
  getAllCategory,
  getById,
  updateCategory,
  deleteCategory
}