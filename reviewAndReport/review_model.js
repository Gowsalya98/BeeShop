const mongoose=require('mongoose')

const reportSchema=mongoose.Schema({
    createdAt:String,
    quotes:String,
    description:String,
    userDetails:{
        type:Object
    },
    product:{
        type:Object
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
},{
    collection:'report'
})

const reviewSchema=mongoose.Schema({
    createdAt:String,
    quotes:String,
    description:String,
    productId:String,
    userId:String,
    deleteFlag:{
        type:Boolean,
        default:false
    }
},{
    collection:'review'
})

const report=mongoose.model('reportSchema',reportSchema)

const reviews=mongoose.model('reviewSchema',reviewSchema)

module.exports={report,reviews}