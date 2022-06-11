const mongoose=require('mongoose')

const FAQSchema=mongoose.Schema({
    createdAt:String,
    question:String,
    answer:String,
    deleteFlag:{
        type:Boolean,
        default:false

    }
},{
    collection:'FAQ'
})

const FAQ=mongoose.model("FAQSchema",FAQSchema)

module.exports={FAQ}