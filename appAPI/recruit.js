const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
// const secret = Date.now().toString()//添加签名
const secret=require('../token/secret')
const jwtAuth = require('koa-jwt')//验证token
// 获取招聘信息
router.get('/getRecruit', async (ctx) => {
    //判读查询所有还是指定的招聘 item=null 全部
    let item = ctx.query.key
    const recruitlist = mongoose.model("Recruit")
    if (!item) {
        let findBanner = await recruitlist.find()
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner
            }
        }
    } else {
        let findBanner = await recruitlist.find({ _id: item })
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner
            }
        }
    }
})
//添加招聘
router.post('/setRecruit', jwtAuth({ secret }), async (ctx) => {
    let { title, items, post, place, money, phone, email } = ctx.request.body
    let createAt = Date.now()
    const recruitlist = mongoose.model("Recruit")
    let recruitItem = new recruitlist({ title: title, post: post, place: place, money: money, items: items, phone: phone, email: email, createAt: createAt })
    await recruitItem.save().then(() => {
        ctx.body = {
            status: 200,
            data: '添加成功'
        }
    }).catch(error => {
        ctx.body = {
            status: 500,
            data: error
        }
    })
})
//删除招聘
router.post('/removeRecruit', jwtAuth({ secret }), async (ctx) => {
    let { id } = ctx.request.body
    const recruitlist = mongoose.model("Recruit")
    await recruitlist.remove({ _id: id }).then(() => {
        ctx.body = {
            status: 200,
            data: '删除成功'
        }
    }).catch(error => {
        ctx.body = {
            status: 500,
            data: error
        }
    })
})
module.exports = router