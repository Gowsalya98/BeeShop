const mongoose=require('mongoose')

const subscriptionSchema=mongoose.Schema({
    createdAt:String,
    orderId:String,
    accountHolderName:String,
    bankName:String,
    branchAddress:String,
    accountNumber:String,
    IFSCCode:String,
    subscriptionPlanName:String,
    subscriptionPlanDays:String,
    subscriptionAmount:String,
    ownerId:String,
    subscriptionEndDate:{
        type:String,
        default:'0'
    },
    validityDays:{
        type:Number,
        default:0
    },
    productId:String,
    ownerId:String,
    productOwner:Object,
},{
    collection:'paymentAndSubScribe'
})
const paymentSchema=mongoose.Schema({
    orderId:String,
    createdAt:String
},{
    collection:'orderId'
})

const subscribe=mongoose.model('subscriptionSchema',subscriptionSchema)
const payment=mongoose.model('paymentSchema',paymentSchema)

module.exports={subscribe,payment}