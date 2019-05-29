const mongoose = require('mongoose')
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId //主键

//创建bannerList
const dutySchema = new Schema({
    ID: ObjectId,
    title: {
        type: String,
    },
    content:{
        type: String,
    },
})
//发布模型
mongoose.model('Duty', dutySchema)