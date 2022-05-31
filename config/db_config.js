const mongoose =require('mongoose')
const urlConfig=require('./url_config')

mongoose.connect(urlConfig.url,{dbName:'BeeShop'},()=>{
    console.log('db connected')
})