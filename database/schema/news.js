const mongoose = require('mongoose')
// const Schema = mongoose.Schema
const Schema = mongoose.Schema

let ObjectId = Schema.Types.ObjectId //主键

//创建bannerList
const newsSchema = new Schema({
    ID: ObjectId,
    TITLE: {
        type: String,
    },
    AUTH: {
        type: String,
    },
    CONTENT: {
        type: String,
    },
    TYPE: {
        type: String,
    },
    FROM: { type: String 
    },
    IMG_MIN: {
        type: String,
    },
    INTRO:{
        type: String, 
    },
    createAt: { type: Date },
})
//发布模型
mongoose.model('News', newsSchema)