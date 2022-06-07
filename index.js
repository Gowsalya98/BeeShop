const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()

const errorThrower = require('./errorHandler/error_thrower')
const appError = require('./errorHandler/common_error_handler')
require('./config/db_config')
const app = express()

const user=require('./user/user_routes')
const superadmin=require('./superAdmin/super_routes')
const category=require('./category/category_routes')
const product=require('./product/product_routes')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/uploads', express.static('/home/fbnode/NODE_GOWSI/uploads/BeeShop'))

app.use('/user',user,product)
app.use('/admin',superadmin,category)

app.get('/',(req,res)=>{
    res.send('welcome BeeShop')
})

app.listen(process.env.PORT, () => {
    console.log("port running on ", process.env.PORT)
})

