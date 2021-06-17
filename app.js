const express = require('express')
// 引入express-async-errors捕获异步函数的异常
require('express-async-errors');

const mongoose = require('mongoose')

const anth = require('./middleware/auth')
const resource = require('./middleware/resource')

const app = express()

// limit 服务器默认接收上传的大小为100kb,可以自己修改
app.use(express.json({ limit: '2100000kb' }))

// 声明使用解析post请求的中间件
app.use(express.urlencoded({ extended: true }))

//静态文件托管
app.use('/public', express.static('public'))


// 使用cors解决跨域
// app.use(require('cors')())

const router = require('./reoutes/admin')

// 引入和注册文件上传/登录接口的路由
const routerFile = require('./reoutes/admin/file-upload')
app.use('/admin/api', routerFile)

// 使用中间件来实现一个通用的CRUD接口
app.use('/admin/api/rest/:resource', anth(), resource(), router)

// 存储全局路由secret
app.set('secret', 'userlogin')

//错误处理函数中间件
app.use(async (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message: err.message
  })
})

mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
).then(() => {
  console.log('数据库连接成功')
  // 当数据库连接成功之后启动服务器
  app.listen(8000, () => {
    console.log('App listen on http://localhost:8000')
  })
}).catch(error => {
  console.log('数据库连接失败', error)
})


