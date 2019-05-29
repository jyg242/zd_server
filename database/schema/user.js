const mongoose = require('mongoose')
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId //主键

//创建bannerList
const userSchema = new Schema({
    UID: ObjectId,
    userName: {
        type: String,
    },
    passWord: {
        type: String,
    },
    level: {
        type: String,
    },
    last:{
        type: String,
    },
    date: {
        type: Date
    }
})
//发布模型
mongoose.model('User', userSchema)