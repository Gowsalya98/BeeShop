const mongoose=require('mongoose')

const subscriptionSchema=mongoose.Schema({
    paymentId:String,
    accountHolderName:String,
    bankName:String,
    branchAddress:String,
    accountNumber:String,
    IFSCCode:String,
    subscriptionPlan:String,
    subscriptionAmount:String,
    createdAt:{
        type:Date,
        default:new Date()
    },
    ownerId:String,
    subscriptionEndDate:{
        type:String,
        default:'0'
    },
    validityDays:{
        type:Number,
        default:'0'
    }

},{
    collection:'subcribeDetails'
})
const paymentSchema=mongoose.Schema({
    paymentId:String,
    createdAt:String
},{
    collection:'paymentDetails'
})

const subscribe=mongoose.model('subscriptionSchema',subscriptionSchema)
const payment=mongoose.model('paymentSchema',paymentSchema)

module.exports={subscribe,payment}