const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
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
    }else{
        // console.log(item)
        let findBanner = await recruitlist.find({_id:item})
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner
            }
        }
    }
})
// 获取新闻一条
// router.get('/getNews_one', async (ctx) => {
//     let item = ctx.query.key
//     const newslist = mongoose.model("News")
//     let findBanner = await newslist.where({ _id: item }).find()
//     if (findBanner) {
//         ctx.body = {
//             status: 200,
//             data: findBanner
//         }
//     }
// })
//添加招聘
router.post('/setRecruit', async (ctx) => {
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
//修改
// router.post('/updateNews', async (ctx) => {
//     let { id, title, type, auth, content } = ctx.request.body
//     const newslist = mongoose.model("News")
//     await newslist.where({ _id: id }).updateOne({ TITLE: title, TYPE: type, AUTH: auth, CONTENT: content }).then(() => {
//         ctx.body = {
//             status: 200,
//             data: '修改成功'
//         }
//     }).catch(error => {
//         ctx.body = {
//             status: 500,
//             data: error
//         }
//     })

// })
//删除
router.post('/removeRecruit', async (ctx) => {
    let { id } = ctx.request.body
    // console.log(id)
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