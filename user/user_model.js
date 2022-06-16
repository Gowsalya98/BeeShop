const mongoose=require('mongoose')

const registerSchema=mongoose.Schema({
    createdAt:String,
    userName:{type:String,default:''},
    email:{type:String,default:''},
    password:{type:String,default:''},
    newPassword:String,
    confirmPassword:String,
    repeatPassword:{type:String,default:''},
    phoneNumber:{type:Number,default:0},
    profileImage:{type:String,default:''},
    accountType:{type:String,default:''},
    billingAddress:{
        BillingAddress:{type:String,default:''},
        billingCity:{type:String,default:''},
        billingState:{type:String,default:''},
        billingCountry:{type:String,default:''},
        billingPincode:{type:Number,default:0},
    },
    shippingAddress:{
        ShippingAddress:{type:String,default:''},
        shippingCity:{type:String,default:''},
        shippingState:{type:String,default:''},
        shippingCountry:{type:String,default:''},
        shippingPincode:{type:Number,default:0},  
    },
    // birthday:{type:String,default:'' },
    skypeId:{type:String,default:'' },
    website:{type:String,default:'' },
    graphDomain:{type:String,default:''},
    faceBookId:{type:Number,default:0},
    GoogleId:{type:Number,default:0},
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

module.exports={
    register,
    otpSchema,
    image}