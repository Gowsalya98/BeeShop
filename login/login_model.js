const mongoose=require('mongoose')

const loginSchema=mongoose.Schema({
    createdAt:{
        type:Date,
        default:Date.now()
    },
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
        default:''
    },
    profileImage:{
        type:String,
        default:''
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
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const login=mongoose.model('loginSchema',loginSchema)
const otpSchema=mongoose.model('otp',otp)
const image=mongoose.model('ImageSchema',ImageSchema)

module.exports={login,otpSchema,image}