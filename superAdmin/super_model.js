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

const superAdmin = mongoose.model('superAdminSchema', superAdminSchema)

module.exports={superAdmin}