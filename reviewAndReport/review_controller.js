const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const {product}=require('../product/product_model')
const {register}=require('../user/user_model')
const {reviews,report}=require('./review_model')
const moment=require('moment')

const createReview=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        if(userToken!=null){
            console.log('line 12',userToken)
            const data1=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(userToken.userId)},{deleteFlag:false}]}}])
            console.log('line 14',data1)
            req.body.userId=data1[0]._id
            if(data1!=null){
                    const data2 =await product.findOne({_id:req.params.productId,deleteFlag:false})
                    console.log('line 17',data2)
                    if(data2!=null){
                        req.body.productId=req.params.productId
                        req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                        const data=await reviews.create(req.body)
                            if(data!=null){
                                console.log('line 24',data)
                                const result1=await product.findOne({_id:data.productId,deleteFlag:false})
                                console.log('line 26',result1.review);
                                if(result1!=null){
                                    var arr=[]
                                    result1.review.map((final)=>{
                                        console.log('line 30',final)
                                        arr.push(final)
                                    })
                                    arr.push(req.body)
                                    console.log('line 34',arr)
                                    const result2=await product.findOneAndUpdate({_id:data.productId},{$set:{review:arr}},{new:true})
                                    console.log('line 36',result2)
                                }else{
                                    res.status(302).send({success:'false',message:'invalid product id'})
                                }
                                res.status(200).send({success:'true',message:'successfully post data',data})
                            }else{
                                res.status(400).send({success:'false',message:'failed to post review'})
                            }
                           
                    }else{
                        res.status(302).send({success:'false',message:'invalid id'})
                    }
                   
                }else{
                    res.status(302).send({success:'false',message:'data not found'})
                }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const getAllReview=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await reviews.aggregate([{$match:{deleteFlag:false}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'All review list',data:data})
            }else{
                res.status(400).send({success:'false',message:'data not found'})
            }
        }else{
            res.status(302).send({message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const createReport=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
            if(userToken!=null){
                const data=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(userToken.userId)},{deleteFlag:false}]}}])
                if(data!=null){
                    console.log('line 92',data)
                    req.body.userDetails=data
                    const result=await product.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.productId)},{deleteFlag:false}]}}])
                    if(result!=null){
                        req.body.product=result
                        const datas=await report.create(req.body)
                        if(datas!=null){
                            res.status(200).send({success:'true',message:'your report send successfully',data:datas})
                        }else{
                            res.status(400).send({success:'false',message:'failed to report this product'})
                        }
                    }else{
                        res.status(302).send({success:'false',message:'invalid product id'})
                    }
                }else{
                    res.status(302).send({success:'false',message:'data not found'})
                }
            }else{
                res.status(302).send({success:'false',message:'unauthorized'})
            }
    }catch(err){
        res.status(500).send({Message:'internal server error'})
    }
}
const getAllReport=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await report.aggregate([{$match:{deleteFlag:false}}])
            if(data!=null){
                data.sort().reverse()
                res.status(200).send({success:'true',message:'All report list',data:data})
            }else{
                res.status(302).send({success:'false',message:'data not found'})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getByIdReport=async(req,res)=>{
    try{
        if(req.params.reportId.length==24){
            const data=await report.aggregate([{$match:{$and:[{"_id":mongoose.Types.ObjectId(req.params.reportId)},{deleteFlag:false}]}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'your data',data:data})
            }else{
                res.status(302).send({success:'false',message:'data not found'})
            }
        }else{
            res.status(302).send({success:'false',message:'invalid report Id'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const deleteReport=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        if(userToken!=null){
            if(req.params.reportId.length==24){
                const datas=await report.findOne({_id:req.params.reportId,deleteFlag:false})
                console.log('line 156',datas)
                if(datas!=null){
                    const data=await report.findOneAndUpdate({_id:req.params.reportId},{$set:{deleteFlag:true}},{returnOriginal:false})
                    if(data!=null){
                        res.status(200).send({message:"Deleted successfully",data})
                    }else{
                        res.status(400).send({message:"failed to delete report "})
                    }
                }else{
                    res.status(302).send({message:"Data not found"})
                }
            }else{
                res.status(400).send({message:"Please provid the vaild id"})
            }
        }else{
            res.status(302).send({message:"Unauthorized"})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'}) 
    }
}
module.exports={
    createReview,
    getAllReview,
    createReport,
    getAllReport,
    getByIdReport,
    deleteReport
}