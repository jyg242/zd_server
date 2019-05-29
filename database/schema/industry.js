const mongoose = require('mongoose')
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId //主键

//创建bannerList
const industrySchema = new Schema({
    ID: ObjectId,
    title: {
        type: String,
    },
    content:{
        type: String,
    },
    createAt: { type: Date },
})
//发布模型
mongoose.model('Industry', industrySchema)