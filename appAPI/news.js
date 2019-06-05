const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
// const secret = Date.now().toString()//添加签名
const secret=require('../token/secret')
const jwtAuth = require('koa-jwt')//验证token
// 获取新闻
router.get('/getNews', async (ctx) => {
    let item = ctx.query.key //查询类型
    let start = ctx.query.page //页数
    let pageNum = 5 //每页条数
    let total = (start - 1) * pageNum
    const newslist = mongoose.model("News")
    //所有新闻
    if (item == 0) {
        let findBanner = await newslist.find()
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner
            }
        }
    } else if (item == 1 || item == 2 || item == 3) { //新闻列表查询
        // console.log(item)
        let findBanner = await newslist.find({ TYPE: item }, ['TITLE', 'createAt', 'IMG_MIN', 'INTRO', 'TYPE'], { sort: { createAt: -1 } }).skip(total).limit(pageNum)
        let res = await newslist.find({ TYPE: item })
        let pageAll = res.length
        // console.log(pageAll)
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner,
                pageAll: pageAll
            }
        }
    } else if (item == 4) { //手机端新闻列表查询
        let pageNum = 8 //每页条数
        let total = (start - 1) * pageNum
        // console.log('执行' + total)
        let findBanner = await newslist.find({}, ['TITLE', 'createAt', 'IMG_MIN', 'INTRO', 'TYPE'], { sort: { createAt: -1 } }).skip(total).limit(pageNum)
        // console.log(total, findBanner)
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner,
            }
        }
    } else {
        let findBanner = await newslist.find({}, ['TITLE', '_id'])
        if (findBanner) {
            ctx.body = {
                status: 200,
                data: findBanner
            }
        }
    }

})
// 获取新闻一条
router.get('/getNews_one', async (ctx) => {
    let item = ctx.query.key
    const newslist = mongoose.model("News")
    let findBanner = await newslist.where({ _id: item }).find()
    if (findBanner) {
        ctx.body = {
            status: 200,
            data: findBanner
        }
    }
})
//添加新闻
router.post('/setNews', jwtAuth({ secret }),async (ctx) => {
    let { type, title, content, auth, from, intro, img_min } = ctx.request.body
    let createAt = Date.now()
    const newslist = mongoose.model("News")
    let newsItem = new newslist({ TYPE: type, AUTH: auth, TITLE: title, CONTENT: content, createAt: createAt, FROM: from, IMG_MIN: img_min, INTRO: intro })
    await newsItem.save().then(() => {
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
//修改新闻
router.post('/updateNews',jwtAuth({ secret }), async (ctx) => {
    let { id, title, type, auth, content, intro, img } = ctx.request.body
    const newslist = mongoose.model("News")
    await newslist.where({ _id: id }).updateOne({ TITLE: title, TYPE: type, AUTH: auth, CONTENT: content, IMG_MIN: img, INTRO: intro }).then(() => {
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
//删除新闻
router.post('/removeNews', jwtAuth({ secret }),async (ctx) => {
    let { id } = ctx.request.body
    const newslist = mongoose.model("News")
    await newslist.remove({ _id: id }).then(() => {
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