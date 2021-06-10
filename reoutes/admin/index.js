

const express = require('express')

const Category = require('../../models/Category')

const router = express.Router()

// 创建分类
router.post('/categories', async (req, res) => {
  // console.log(req.body)
  const category = await Category.findOne(req.body)
  // console.log(category)
  if (category) { //如果不为null，说明已经存在改分类，不在创建分类，返回创建失败信息
    res.send({ status: 1, message: '已存在相同名称的分类，请创建不同名称的分类' })
  } else {
    const model = await Category.create(req.body)
    res.send(model)
  }

})

// 修改分类
router.post('/categories/update', async (req, res) => {
  // console.log(req.body)
  const model = await Category.findByIdAndUpdate(req.body.id, req.body)
  res.send(model)
})

// 删除分类
router.post('/categories/dalete', async (req, res) => {
  // console.log(req.body)
  const model = await Category.findByIdAndUpdate(req.body.id, req.body)
  res.send(model)
})

// 获取分类列表
router.get('/categories', async (req, res) => {
  const items = await Category.find()
  res.send(items)
})

// 获取分类详情
router.get('/categories/detail', async (req, res) => {
  // console.log(req.query)
  // get请求的参数从req.query获取
  const model = await Category.findById(req.query.id)
  res.send(model)
})

module.exports = router

