const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: { type: String },
  avatar: { type: String },
  title: { type: String },
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
  // 复合类型
  scores: {
    difficult: { type: Number },
    skills: { type: Number },
    attack: { type: Number },
    survive: { type: Number },
  },
  // 技能
  skills: [{
    icon: { type: String },
    name: { type: String },
    description: { type: String },
  }],
  // 顺风出装
  items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'item' }],
  // 逆风出装
  items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'item' }],
  usageTips: { type: String },
  battleTips: { type: String },
  teamTips: { type: String },
  partners: [{
    hero: { type: mongoose.SchemaTypes.ObjectId, ref: 'Hero' },
    description: { type: String }
  }],
})


module.exports = mongoose.model('Hero', schema)