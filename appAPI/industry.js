const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
// const secret = Date.now().toString()//添加签名
const secret=require('../token/secret')
const jwtAuth = require('koa-jwt')//验证token
// 获取产业
router.get('/getIndustry', async (ctx) => {
    let item = ctx.query.key
    const industrylist = mongoose.model("Industry")
    if (item==null) {
        let findBanner = await industrylist.find()
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner
            }
        }
    }else{
        let findBanner = await industrylist.where({ _id: item }).find()
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner
            }
        }
    }
})
//添加产业
router.post('/setIndustry',jwtAuth({ secret }), async (ctx) => {
    let { title, content } = ctx.request.body
    let createAt = Date.now()
    const industrylist = mongoose.model("Industry")
    let industryItem = new industrylist({ title: title, content: content, createAt: createAt })
    await industryItem.save().then(() => {
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
//修改产业
router.post('/updateIndustry',jwtAuth({ secret }), async (ctx) => {
    let { id, title, content } = ctx.request.body
    const industrylist = mongoose.model("Industry")
    await industrylist.where({ _id: id }).updateOne({ title: title, content: content }).then(() => {
        ctx.body = {
            status: 200,
            data: '修改成功'
        }
    }).catch(error => {
        ctx.body = {
            status: 500,
            data: error
        }
    })

})
//删除产业
router.post('/removeIndustry',jwtAuth({ secret }), async (ctx) => {
    let { id } = ctx.request.body
    const industrylist = mongoose.model("Industry")
    await industrylist.remove({ _id: id }).then(() => {
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