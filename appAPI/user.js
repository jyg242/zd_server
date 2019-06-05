const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
const captcha = require('trek-captcha');//验证码
const jwt = require('jsonwebtoken')  //生成token
const jwtAuth = require('koa-jwt')//验证token
const secret=require('../token/secret')//添加签名
//用户上传
const multer = require('koa-multer')
//配置用户上传内容
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, './public/abc')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
var upload = multer({ storage: storage })
router.post('/upload', upload.single('file'), ctx => {
    ctx.body = '上传成功'
})
// 登录路由
router.post('/login', async (ctx) => {
    let { userName, passWord, capchea } = ctx.request.body
    let a = ctx.session.captcha
    if (a == capchea) {
        const userlist = mongoose.model("User")
        let res = await userlist.find({ userName, passWord }, ['_id', 'level', 'userName'])
        if (res.length > 0) { //匹配到用户
            ctx.session.info=res
            let user = res[0].userName //用户名
            let level = res[0].level //权限等级
            //设置登录token
            let token = jwt.sign(
                {
                    data: res,
                    exp: Math.floor(Date.now() / 1000 + 60)
                },
                secret
            )
            ctx.body = {
                status: 200,
                data: token, //发送给钱端
                level,
                user,
                msg: '登陆成功'
            }
        } else {
            ctx.body = {
                status: 1000,
                msg: '登录失败'
            }
        }
    } else {
        ctx.body = {
            status: 2000,
            msg: '验证码错误'
        }
    }

})
//验证管理员
router.post('/admin',async(ctx)=>{
    let detail=ctx.session.info
    ctx.body=detail
})
//验证码
router.get('/captcha', async (ctx) => {
    const { token, buffer } = await captcha({ size: 4 })
    ctx.session.captcha = token
    ctx.body = buffer
})
//测试验证码
router.get('/getcap', async (ctx) => {
    console.log(secret)
    let n = ctx.session.captcha //此处得到的n 就是上面生成的验证码
    ctx.body = n
})
//管理员注册路由
router.post('/register', jwtAuth({ secret }), async (ctx) => {
    let { userName, passWord, level } = ctx.request.body
    const userlist = mongoose.model("User")
    let userExisit = await userlist.find({ userName })
    if (userExisit.length > 0) {
        ctx.body = {
            status: 200,
            data: '注册失败,账号已存在'
        }
        return
    }
    let userItem = await userlist({ userName, passWord, level })
    await userItem.save()
    ctx.body = {
        status: 200,
        data: '注册成功'
    }
})
//查询管理列表路由
router.post('/admin_list', jwtAuth({ secret }), async (ctx) => {
    const userlist = mongoose.model("User")
    let useritem = await userlist.find(null, ['userName', 'level', 'last', 'passWord'])
    if (useritem) {
        ctx.body = {
            status: 200,
            data: useritem
        }
        return
    }
})
//删除管理员名单
router.post('/remove_adminList', jwtAuth({ secret }), async (ctx) => {
    let { id } = ctx.request.body
    const userlist = mongoose.model("User")
    let useritem = await userlist.find({ _id: id }).remove()
    if (useritem) {
        ctx.body = {
            status: 200,
            data: '删除成功'
        }
        return
    }
})
//修改密码
router.post('/change_password', jwtAuth({ secret }),async (ctx) => {
    let { oldpwd, newpwd } = ctx.request.body.values
    let res1 = ctx.request.header.authorization //获取头部令牌
    let tokens = res1.substr(7)//提取令牌主题
    let item = jwt.verify(tokens, secret)//反编译出令牌内容
    let res = item.data[0].userName
    let userName = res
    const userlist = mongoose.model("User")
    let useritem = await userlist.find({ userName: userName, passWord: oldpwd }).updateOne({ passWord: newpwd })
    if (useritem.nModified == 1) {
        ctx.body = {
            status: 200,
            data: '修改成功'
        }
    } else {
        ctx.body = {
            status: 200,
            data: '修改失败'
        }
    }
})
//更新管理员信息
router.post('/update_admin', jwtAuth({ secret }), async (ctx) => {
    let { level, passWord, userName } = ctx.request.body
    const userlist = mongoose.model("User")
    let useritem = await userlist.find({ userName }).updateOne({ level, passWord })
    if (useritem.nModified == 1) {
        ctx.body = {
            status: 200,
            data: '修改成功'
        }
    } else {
        ctx.body = {
            status: 200,
            data: '修改失败'
        }
    }
})
module.exports = router