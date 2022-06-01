const mongoose=require('mongoose')

const loginSchema=mongoose.Schema({
    createdAt:String,
    userName:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
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

const login=mongoose.model('loginSchema',loginSchema)
const otpSchema=mongoose.model('otp',otp)
const image=mongoose.model('ImageSchema',ImageSchema)

module.exports={login,otpSchema,image}