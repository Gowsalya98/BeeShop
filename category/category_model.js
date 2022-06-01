const mongoose=require('mongoose')

const subCategory=mongoose.Schema({
    productName:String
})

const categoryDetails=mongoose.Schema({
    categoryName:String,
    typeOfCategory:[subCategory]

})

const superAdminAddCategoryDetails=mongoose.Schema({
    createdAt:String,
    superAdminId:String,
    category:[categoryDetails],
    deleteFlag:{
        type:Boolean,
        default:false
    }
},{
    collection:'category'
})

const category=mongoose.model('superAdminAddCategoryDetails',superAdminAddCategoryDetails)

module.exports={category}