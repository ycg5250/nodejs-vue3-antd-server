/**自动获取模型中间件 */
module.exports = options => {
  return async (req, res, next) => {
    //使用inflection来把对应的模型复数转换成类名
    const modelName = require('inflection').classify(req.params.resource)
    //在req上添加一个Model
    req.Model = require(`../models/${modelName}`)
    next()
  }
}