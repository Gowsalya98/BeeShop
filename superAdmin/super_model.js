const mongoose = require('mongoose');

const superAdminSchema = mongoose.Schema({
    createdAt:String,
    userName : String,
    email : String,
    password: String,
    contact : Number,
    role: {
        type: String, 
        default: "superadmin"
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
}, {
    collection: 'superAdmin'
})
const packageSchema=mongoose.Schema({
    createdAt:String,
    subscriptionPlanName:String,
    subscriptionAmount:String,
    description:[String],
    deleteFlag:{
        type:Boolean,
        default:false
    }
},{
    collection:'package'
})
const superAdmin = mongoose.model('superAdminSchema', superAdminSchema)

const package=mongoose.model('packageSchema',packageSchema)

module.exports={superAdmin,package}