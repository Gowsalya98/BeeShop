const mongoose=require('mongoose')

const sellProductSchema=mongoose.Schema({
    createdAt:String,
    productOwnerId:String,
    productDetails:{
    productTitle:String,
    productimage:String,
    productCategory:String,
    price:Number,
    adCategory:String,
    priceCondition:String,
    productCondition:String,
    adDescription:String,
    adTags:String,
    productLocation:String
    },
    userDetails:{
    userName:String,
    email:String,
    phoneNumber:String,
    profileImage:String   
    },
    subscriptionPlan:{
    planName:{
        type:String,
        default:''
    },
    planPrice:{
        type:Number,
        default:0
    }
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
},{
    collection:'productSchema'
})

const product=mongoose.model('sellProductSchema',sellProductSchema)

module.exports={product}