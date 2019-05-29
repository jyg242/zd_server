const mongoose = require('mongoose')
// const Schema = mongoose.Schema
const Schema = mongoose.Schema

let ObjectId = Schema.Types.ObjectId //主键

//创建bannerList
const bannerSchema = new Schema({
    ID: ObjectId,
    IMGURL: {
        type: String,
    },
    TYPE:{
        type: String,
    }
})
//发布模型
mongoose.model('Banner', bannerSchema)