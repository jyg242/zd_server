const Koa = require('koa');
const app = new Koa();
// 安装mongDB
const mongoose = require('mongoose');
//安装路由
const Router = require('koa-router')
let router = new Router()
//安装bodyparser
const bodyParser = require('koa-bodyparser')
//安装cors
const cors = require('koa2-cors')
// 引入路由
const user = require('./appAPI/user')
const banner = require('./appAPI/banner')
const news = require('./appAPI/news')
const industry = require('./appAPI/industry')
const duty = require('./appAPI/duty')
const recruit = require('./appAPI/recruit')

const { connect, initSchemas } = require('./database/init.js');

// cors解决跨域
app.use(cors(
    // {
    //     origin: 'http://localhost:8080', //白名单
    //     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    //     maxAge: 5,
    //     credentials: true,
    //     allowMethods: ['GET', 'POST', 'DELETE'],
    //     // allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    // }
))
// bodyParser中间件接收post请求
app.use(bodyParser())
// 加载路由
router.use('/user', user.routes())
router.use('/banner', banner.routes())
router.use('/news', news.routes())
router.use('/industry', industry.routes())
router.use('/duty', duty.routes())
router.use('/recruit', recruit.routes())


// 加载路由中间件
app.use(router.routes())
app.use(router.allowedMethods(0));



(async () => {
    await connect()
    initSchemas()
})()
app.use(async (ctx) => {
    ctx.body = '<h1>小飞欢迎你</h1>'
})
//创建服务器
app.listen(3000, () => {
    console.log('服务器创建成功')
})