const mongoose = require('mongoose')
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId //主键

//创建bannerList
const recruitSchema = new Schema({
    ID: ObjectId,
    title: {
        type: String,
    },
    items:{
        type: Array,
    },
    post:{
        type: String,
    },
    place:{
        type: String,
    },
    money:{
        type: String,
    },
    phone:{
        type: String,
    },
    email:{
        type: String,
    },
    
    createAt: { type: Date },
})
//发布模型
mongoose.model('Recruit', recruitSchema)