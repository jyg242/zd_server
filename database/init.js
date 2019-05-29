const mongoose = require('mongoose')
const db = 'mongodb://localhost/zd_abc'
const glob = require('glob')
const { resolve } = require('path')
exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}
exports.connect = () => {
    //链接数据库
    mongoose.connect(db, { useNewUrlParser: true })
    let maxConnectTimes = 0
    return new Promise((resolve, reject) => {
        //增加数据库监听事件
        //断开链接
        mongoose.connection.on('disconnected', () => {
            console.log('*******数据库断开*******')
            if (maxConnectTimes <= 3) {
                maxConnectTimes++
                mongoose.connect(db)
            } else {
                reject()
                throw new Error('数据库出现问题,程序无法搞定,请人为修理')
            }
        })
        //数据错误
        mongoose.connection.on('error', () => {
            console.log('*******数据库错误*******')
            if (maxConnectTimes <= 3) {
                maxConnectTimes++
                mongoose.connect(db)
            } else {
                reject()
                throw new Error('数据库出现问题,程序无法搞定,请人为修理')
            }
        })
        //链接打开时
        mongoose.connection.once('open', () => {
            console.log('数据库链接成功')
            resolve()
        })
    })
}