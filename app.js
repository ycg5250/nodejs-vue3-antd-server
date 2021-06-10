const express = require('express')

const mongoose = require('mongoose')

const app = express()

app.use(express.json())

// 声明使用解析post请求的中间件
app.use(express.urlencoded({ extended: true }))

// 使用cors解决跨域
// app.use(require('cors')())

const router = require('./reoutes/admin')

app.use('/admin/api', router)

mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
  console.log('数据库连接成功')
  // 当数据库连接成功之后启动服务器
  app.listen(8000, () => {
    console.log('App listen on http://localhost:8000')
  })
}).catch(error => {
  console.log('数据库连接失败', error)
})


