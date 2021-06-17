/**登陆校验中间件 */
module.exports = options => {
  const assert = require('http-assert')
  const jwt = require('jsonwebtoken')
  const AdminUser = require('../models/AdminUser')
  return async (req, res, next) => {
    // 获取token
    const token = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 401, '请先登录')
    // 提取token的数据
    const { id } = jwt.verify(token, req.app.get('secret'))
    assert(id, 401, '请先登录')
    // 通过id从数据库查找是否存在该用户并挂载到req上
    req.user = await AdminUser.findById(id)
    assert(req.user, 401, '请先登录')
    next()
  }
}