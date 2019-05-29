const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
const proving = require('../token/proving');//验证token
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
router.post('/setImg', async (ctx) => {
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
//修改
router.post('/updateImg', async (ctx) => {
    let { id, imgurl, type } = ctx.request.body
    let token = ctx.request.header['x-token']
    if (token) {
        //  获取到token
        let res = proving(token);
        if (res && res.exp <= new Date() / 1000) {
            ctx.body = {
                data: '登录超时',
                status: 200
            };
        } else {
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
        }
    } 
})
//删除图片
router.post('/removeImg', async (ctx) => {
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