const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
const addtoken = require('../token/addtoken'); //设置token
const proving = require('../token/proving');//验证token


// 登录路由
router.post('/login', async (ctx) => {
    let { userName, passWord } = ctx.request.body
    const userlist = mongoose.model("User")
    let res = await userlist.find({ userName, passWord }, ['_id', 'level', 'userName'])
    if (res.length > 0) { //匹配到用户
        let user = res[0].userName //用户名
        let level = res[0].level //权限等级
        let token = addtoken(res[0]); //写入token
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
})
//注册路由
router.post('/register', async (ctx) => {
    let { userName, passWord, level } = ctx.request.body
    const userlist = mongoose.model("User")
    let userExisit = await userlist.find({ userName })
    // console.log(userExisit)
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
router.post('/admin_list', async (ctx) => {
    // let { userName, passWord, level } = ctx.request.body
    let token = ctx.request.header['x-token']
    let res = proving(token);
    // console.log(res)
    const userlist = mongoose.model("User")
    let useritem = await userlist.find(null, ['userName', 'level', 'last','passWord'])
    // console.log(useritem)
    if (useritem) {
        ctx.body = {
            status: 200,
            data: useritem
        }
        return
    }
})
//删除管理员名单
router.post('/remove_adminList', async (ctx) => {
    let { id } = ctx.request.body
    // console.log(id)
    const userlist = mongoose.model("User")
    let useritem = await userlist.find({ _id: id }).remove()
    // console.log(useritem)
    if (useritem) {
        ctx.body = {
            status: 200,
            data: '删除成功'
        }
        return
    }
})
//修改密码
router.post('/change_password', async (ctx) => {
    let { oldpwd, newpwd } = ctx.request.body.values
    let token = ctx.request.header['x-token']
    let res = proving(token);
    let userName = res.user
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
router.post('/update_admin', async (ctx) => {
    let {  level,passWord ,userName} = ctx.request.body
    let token = ctx.request.header['x-token']
    let res = proving(token);
    if (res && res.exp <= new Date() / 1000) {
        ctx.body = {
            data: '登录超时',
            status: 200
        };
    } else {
        const userlist = mongoose.model("User")
        let useritem = await userlist.find({ userName}).updateOne({ level,passWord })
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
    }

})
module.exports = router