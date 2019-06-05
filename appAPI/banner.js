const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
// const secret = Date.now().toString()//添加签名
const secret=require('../token/secret')
const jwtAuth = require('koa-jwt')//验证token
// 获取图片
router.get('/getImg', async (ctx) => {
    let item = ctx.query.key
    const bannerlist = mongoose.model("Banner")
    let findBanner = await bannerlist.find()
    if (findBanner) {
        ctx.body = {
            status: 200,
            data: findBanner
        }
    }
})
//添加图片
router.post('/setImg', jwtAuth({ secret }), async (ctx) => {
    let { imgurl, type } = ctx.request.body
    const bannerlist = mongoose.model("Banner")
    let imglist = new bannerlist({ IMGURL: imgurl, TYPE: type })
    await imglist.save().then(() => {
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
//修改图片
router.post('/updateImg', jwtAuth({ secret }), async (ctx) => {
    let { id, imgurl, type } = ctx.request.body

    //验证通过
    const bannerlist = mongoose.model("Banner")
    await bannerlist.where({ _id: id }).updateOne({ IMGURL: imgurl, TYPE: type }).then(() => {
        ctx.body = {
            status: 200,
            data: '修改成功'
        }
    }).catch(error => {
        ctx.body = {
            status: 200,
            data: error
        }
    })
})
//删除图片
router.post('/removeImg', jwtAuth({ secret }), async (ctx) => {
    let { id } = ctx.request.body
    const bannerlist = mongoose.model("Banner")
    await bannerlist.remove({ _id: id }).then(() => {
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