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
            const datas=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(userToken.userId)},{deleteFlag:false}]}}])
            console.log('line 14',datas)
            req.body.userDetails=datas
            if(datas!=null){
                    const result =await product.findOne({_id:req.params.productId,deleteFlag:false})
                    console.log('line 17',result)
                    if(result!=null){
                        req.body.productId=req.params.productId
                        req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                        const data=await reviews.create(req.body)
                            if(data!=null){
                                console.log('line 24',data)
                                //res.status(200).send({success:'true',message:'successfully post data',data})
                            }else{
                                res.status(400).send({success:'false',message:'failed to post review'})
                            }
        //                     var reviewDetails={}
        //                     reviewDetails.quotes=req.body.quotes
        //                     reviewDetails.description=req.body.description
        //                     reviewDetails.userName=datas[0].userName
        //                     reviewDetails.email=datas[0].email
        //                     req.body.review=reviewDetails
                            const result1=await product.findOne({_id:data.productId,deleteFlag:false})
                            console.log('line 19',result1.review);
                            if(result1!=null){
                                var arr=[]
                            }else{
                                res.status(302).send({success:'false',message:'does not update product details'})
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

    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={createReview}