
const express = require('express')

const jwt = require('jsonwebtoken')

const AdminUser = require('../../models/AdminUser')

// 登录校验中间件
const loginMiddleWare = require('../../middleware/auth')

const router = express.Router({
  mergeParams: true
})

// 创建资源
router.post('/', async (req, res) => {
  const { name } = req.body
  if (name === undefined) { // 不需要限制名称相同的处理
    const model = await req.Model.create(req.body)
    res.send(model)
  } else {
    const screen = { name }
    const category = await req.Model.findOne(screen)
    // console.log(category)
    if (category) { //如果不为null，说明已经存在改分类，不在创建分类，返回创建失败信息
      res.send({ status: 1, message: '创建失败，已存在相同的名称' })
    } else {
      const model = await req.Model.create(req.body)
      res.send(model)
    }
  }

})

// 修改资源
router.post('/update', async (req, res) => {
  // console.log(req.body)
  const model = await req.Model.findByIdAndUpdate(req.body._id, req.body)
  // console.log(model)
  res.send(model)
})

// 删除资源
router.post('/delete', async (req, res) => {
  // console.log(req.body)
  await req.Model.findByIdAndRemove(req.body.id)
  res.send({ status: 0, message: '删除资源成功' })
})

// 获取资源列表
router.get('/', async (req, res) => {
  // 判断是否需要添加populate方法
  const queryOptions = {}
  if (req.Model.modelName === 'Category') {
    queryOptions.populate = 'parent'
  }
  const items = await req.Model.find().setOptions(queryOptions).limit(200)
  res.send(items)
})

// 获取资源详情
router.get('/detail', async (req, res) => {
  // console.log(req.query)
  // get请求的参数从req.query获取
  const model = await req.Model.findById(req.query.id)
  res.send(model)
})

// require('./file-upload')(router)

module.exports = router

