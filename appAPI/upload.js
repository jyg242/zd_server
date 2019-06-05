const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
const upload=require('koa-multer')({dest:'./public/abc'})


router.post('/upload',upload.single('file'),ctx=>{
    console.log(ctx)
    ctx.req.file;
    ctx.req.body;
    ctx.body='上传成功'
})
module.exports = router