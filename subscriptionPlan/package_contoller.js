const mongoose=require('mongoose')
const razorpay=require('razorpay')
const jwt=require('jsonwebtoken')
const moment=require('moment')
const {product}=require('../product/product_model')
const {subscribe,payment}=require('./package_model')

const createOrderId=(req,res)=>{
    try{
        const instance=new razorpay({
            key_id: 'rzp_test_GUxQPzcyYr9u9P', 
            key_secret: 'L33CkDSL2wI8qOHhIQRnZOoF' 
        })
        var options={
            amount:100,
            currency:"INR",
            receipt: "order_rcptid_11"  
        }
        instance.orders.create(options,(err,order)=>{
            if(err){
                res.status(400).send({success:'false',message:'failed'})
            }else{
                req.body.orderId=order.id
                req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                payment.create(req.body,(err,data)=>{
                    if(err){
                        res.status(400).send({success:'false',message:'failed to create order id'})
                    }else{
                        res.status(200).send({success:'true',message:'successfully generate order id',data})
                    }
                })
            }
        })
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const subscriptionPlan=async(req,res)=>{
    try{
        if(req.params.productId.length==24){
            const alreadyExist=await subscribe.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.productId)}}])
            console.log('line 42',alreadyExist)    
            if(alreadyExist.length!=0){
                const productOwnerData=await product.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.productId)}}])
                const oldDate=new Date(productOwnerData[0].subscriptionEndDate)
                const currentDate=new Date()
                const differInDays=moment(oldDate).diff(moment(currentDate),'days')
                if(req.body.subscriptionPlanDays=='15 days'){
           
                    req.body.validityDays=15+differInDays
                    req.body.subscriptionEndDate=moment(new Date()).add(15+differInDays,'days').toISOString()
                    }
                  if(req.body.subscriptionPlanDays=='1 month'){
                    req.body.validityDays=30+differInDays
                    req.body.subscriptionEndDate=moment(new Date()).add(30+differInDays,'days').toISOString()
                    }
                      req.body.productId=req.params.productId
                      const createPaymentAgain=await subscribe.create(req.body)
                      console.log('line 59',createPaymentAgain)
            }else{
                    req.body.productId=req.params.productId
                    const data=await product.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.productId)},{deleteFlag:false}]}}])
                    console.log('line 62',data)    
                    if(data.length!=null){
                        req.body.ownerId=data.productOwnerId
                        req.body.productOwner=data
                        
                        req.body.createdAt=moment(new Date()).toISOString()
                        const createPayment=await subscribe.create(req.body)
                        console.log('line 66',createPayment)
            
                        if(createPayment.subscriptionPlanDays=='15 days'){
                                req.body.subscriptionEndDate=moment(createPayment.createdAt).add(15,'days').toISOString()
                                req.body.validityDays=15
                        }
            
                        if(createPayment.subscriptionPlanDays=='1 month'){
                                req.body.subscriptionEndDate=moment(createPayment.createdAt).add(30,'days').toISOString()
                                req.body.validityDays=30
                        }
                            req.body.subscriptionStartDate=createPayment.createdAt
                            req.body.orderId=createPayment.orderId
                            req.body.paymentStatus='paid' 
                        
                     }//else{
                    //     res.status(302).send({success:'false',message:'data not found'})
                    // }    
            }
            const paymentDetailsUpdate=await subscribe.findOneAndUpdate({productId:req.params.productId},req.body,{new:true})
            console.log('...',paymentDetailsUpdate)
            const productDetailsUpdate = await product.findByIdAndUpdate(req.params.productId, req.body, { new: true })
             console.log('product:',productDetailsUpdate)
            res.status(200).send({success:'true',message:'payment created successfully',paymentDetailsUpdate})

        }else{
            res.status(302).send({success:'false',message:'invalid product id'})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
const filterToPremiumPackage=async(req,res)=>{
    try{
        
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getAll=async(req,res)=>{
    try{ 
        const superAdminToken=jwt.decode(req.headers.authorization)
            if(superAdminToken!=null){
                const data=await subscribe.find({})
                if(data.length!=0){
                    data.sort().reverse()
                    res.status(200).send({success:'true',message:'All payment details',data:data})
                }else{
                    res.status(302).send({success:'false',message:'data is empty'})
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
        if(req.params.paymentId.length==24){
            const data=await subscribe.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.paymentId)}}])
                if(data!=null){
                    res.status(200).send({success:'true',message:'your payment details',data:data})
                }else{
                    res.status(302).send({success:'false',message:'data not found'})
                }
        }else{
            res.status(400).send({success:'false',message:'invalid id'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    createOrderId,
    subscriptionPlan,
    filterToPremiumPackage,
    getAll,
    getById
}