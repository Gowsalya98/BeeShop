const {product}=require('./product_model')
const mongoose=require('mongoose')
const moment=require('moment')

const  categoryWiseNewest=async(req,res)=>{
    try{
        const data=await product.aggregate([{$match:{$and:[{"productDetails.productCategory":req.params.categoryName},{deleteFlag:false}]}}])
        console.log('line 8',data);
        if(data.length!=0){
            const newProduct=moment(new Date()).toISOString().slice(0,10)
            console.log('line 11',newProduct)
            var arr=[]
            data.map((result)=>{
                if(newProduct==result.createdAt){
                    arr.push(result)
                }
            })
            console.log('line 18',arr)
            res.status(200).send({success:'true',message:'newest product list',arr})
        }else{
            res.status(302).send({success:'false',message:'data not found'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
} 
const categoryWiseLowToHigh=async(req,res)=>{
    try{
        const data=await product.aggregate([{$match:{$and:[{"productDetails.productCategory":req.params.categoryName},{deleteFlag:false}]}},{$sort:{"productDetails.price":1}}])
        if(data.length!=0){
            res.status(200).send({success:'true',message:'low to high price product list',data})
        }else{
            res.status(302).send({success:'false',message:'data not found'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const categoryWisehighToLow=async(req,res)=>{
    try{
        const data=await product.aggregate([{$match:{$and:[{"productDetails.productCategory":req.params.categoryName},{deleteFlag:false}]}},{$sort:{"productDetails.price":-1}}])
        if(data.length!=0){
            res.status(200).send({success:'true',message:'high to low price product list',data})
        }else{
            res.status(302).send({success:'false',message:'data not found'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    categoryWiseNewest,
    categoryWiseLowToHigh,
    categoryWisehighToLow
}