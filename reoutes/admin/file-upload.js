
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const express = require('express')
const multer = require('multer')
const assert = require('http-assert')

const AdminUser = require('../../models/AdminUser')
const upload = multer({ dest: __dirname + '/../../public/uploads' })

const routerFile = express.Router()

// 上传图片
routerFile.post('/upload', upload.single('avatar'), async (req, res) => {
  console.log('上传图片成功')
  const file = req.file
  file.url = `http://localhost:8000/public/uploads/${file.filename}`
  res.send(file)
})

// 登录后台admin
routerFile.post('/login', async (req, res, next) => {
  console.log('请求登录')
  const { username, password } = req.body
  // 1.根据用户名查找密码
  const user = await AdminUser.findOne({ username }).select('+password')
  assert(user, 422, '用户名不存在')
  // 2.校验密码
  const isValid = bcrypt.compareSync(password, user.password)
  assert(isValid, 422, '密码错误')
  // 3.返回token
  // const secret = 'userlogin'
  const token = jwt.sign({ id: user._id }, req.app.get('secret'))
  res.send({ status: 0, token })
})


module.exports = routerFile

