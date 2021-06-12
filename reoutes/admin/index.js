

const express = require('express')

// const Category = require('../../models/Category')

const router = express.Router({
  mergeParams: true
})

// 创建分类
router.post('/', async (req, res) => {
  const { name } = req.body
  const screen = { name }
  const category = await req.Model.findOne(screen)
  // console.log(category)
  if (category) { //如果不为null，说明已经存在改分类，不在创建分类，返回创建失败信息
    res.send({ status: 1, message: '创建失败，已存在相同的名称' })
  } else {
    const model = await req.Model.create(req.body)
    res.send(model)
  }

})

// 修改分类
router.post('/update', async (req, res) => {
  // console.log(req.body)
  const model = await req.Model.findByIdAndUpdate(req.body._id, req.body)
  res.send(model)
})

// 删除分类
router.post('/delete', async (req, res) => {
  // console.log(req.body)
  await req.Model.findByIdAndRemove(req.body.id)
  res.send({ status: 0, message: '删除分类成功' })
})

// 获取分类列表
router.get('/', async (req, res) => {
  // 判断是否需要添加populate方法
  const queryOptions = {}
  if (req.Model.modelName === 'Category') {
    queryOptions.populate = 'parent'
  }
  const items = await req.Model.find().setOptions(queryOptions).limit(10)
  res.send(items)
})

// 获取分类详情
router.get('/detail', async (req, res) => {
  // console.log(req.query)
  // get请求的参数从req.query获取
  const model = await req.Model.findById(req.query.id)
  res.send(model)
})

// require('./file-upload')(router)

module.exports = router

