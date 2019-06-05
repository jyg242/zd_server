const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
// const secret = Date.now().toString()//添加签名
const secret=require('../token/secret')
const jwtAuth = require('koa-jwt')//验证token
// 获取产业
router.get('/getDuty', async (ctx) => {
    let item = ctx.query.key
    const dutylist = mongoose.model("Duty")
    if (item == null) {
        let findBanner = await dutylist.find()
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner
            }
        }
    } else {
        let findBanner = await dutylist.where({ _id: item }).find()
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner
            }
        }
    }
})
//获取产业手机端
router.get('/getDutyH5', async (ctx) => {
    let item = ctx.query.key
    const dutylist = mongoose.model("Duty")
    let findBanner = await dutylist.find({ title: item })
    if (findBanner) {
        ctx.body = {
            status: 200,
            data: findBanner
        }
    }
})
//添加产业
router.post('/setDuty', jwtAuth({ secret }), async (ctx) => {
    let { title, content } = ctx.request.body
    const dutylist = mongoose.model("Duty")
    let dutyItem = new dutylist({ title: title, content: content })
    await dutyItem.save().then(() => {
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
router.post('/updateDuty', jwtAuth({ secret }), async (ctx) => {
    let { id, title, content } = ctx.request.body
    const dutylist = mongoose.model("Duty")
    await dutylist.where({ _id: id }).updateOne({ title: title, content: content }).then(() => {
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
router.post('/removeDuty', jwtAuth({ secret }), async (ctx) => {
    let { id } = ctx.request.body
    const dutylist = mongoose.model("Duty")
    await dutylist.remove({ _id: id }).then(() => {
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