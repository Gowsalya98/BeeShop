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
    productOwnerDetails:{
    userName:String,
    email:String,
    phoneNumber:String,
    profileImage:String,
    address:String,
    city:String,
    state:String
    },
    rating:{
        type:Number,
        default:0
    },
    review:[Object], 
    paymentStatus:{
        type:String,
        default:'pending'
    },
    orderId:{
        type:String,
        default:'0'
    },
    subscriptionPlanName:{
        type:String,
        default:'0'
    },
    subscriptionAmount:{
        type:String,
        default:'0'
    },
    subscriptionStartDate:{
        type:String,
        default:'0'
    },
    subscriptionEndDate:{
        type:String,
        default:'0'
    },
    validityDays:{
        type:Number,
        default:0
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