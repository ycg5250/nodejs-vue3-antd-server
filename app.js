const express = require('express')

const mongoose = require('mongoose')

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

// 引入和注册文件上传的路由
const routerFile = require('./reoutes/admin/file-upload')
app.use('/admin/api', routerFile)

// 使用中间件来实现一个通用的CRUD接口
app.use('/admin/api/rest/:resource', async (req, res, next) => {
  //使用inflection来把对应的模型复数转换成类名
  const modelName = require('inflection').classify(req.params.resource)
  //在req上添加一个Model
  req.Model = require(`./models/${modelName}`)
  next()
}, router)

// app.get('/admin/api/upload', (req, res) => {
//   console.log('请求成功')
//   res.send('请求成功')
// })

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


