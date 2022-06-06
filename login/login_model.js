const mongoose=require('mongoose')

const registerSchema=mongoose.Schema({
    createdAt:String,
    userName:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    password:{
        type:String,
        default:''
    },
    termsAndConditions:{
        type:Boolean,
        default:false
    },
    phoneNumber:{
        type:Number,
        default:0
    },
    profileImage:{
        type:String,
        default:''
    },
    graphDomain:{
        type:String,
        default:''
    },
    faceBookId:{
        type:Number,
        default:0
    },
    GoogleId:{
        type:Number,
        default:0
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
},{
    collection:'registerSchema'
})

const otp = mongoose.Schema({
    otp: Number,
    userDetails: {
        type: Object
    },
   
})

const ImageSchema=mongoose.Schema({
    image:String,
    deleteFlag:{
        type:Boolean,
        default:false
    },
    createdAt:String
})

const register=mongoose.model('registerSchema',registerSchema)
const otpSchema=mongoose.model('otp',otp)
const image=mongoose.model('ImageSchema',ImageSchema)

module.exports={register,otpSchema,image}