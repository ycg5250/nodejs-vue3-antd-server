const { populate } = require('../../models/Article')
const Hero = require('../../models/Hero')

module.exports = app => {
  const mongoose = require('mongoose')
  const router = require('express').Router()
  const Article = require('../../models/Article')
  const Category = require('../../models/Category')

  // 导入新闻数据 
  router.get('/news/init', async (req, res) => {
    const parent = await Category.findOne({
      name: '新闻分类'
    })
    const cats = await Category.find().where({
      parent: parent
    }).lean()
    const newsTitle = ["腾讯看点|新英雄“云缨”优质内容征集活动开启", "狄某有话说 | 姜子牙怎么玩？一局46.5个大", "投稿赢好礼，B站视频征集活动火热进行中！", "青白蛇设计稿方案票选结果公布", "蒙犽皮肤预售开启，来斗鱼百分百赢豪礼", "6月20日赛季挑战活动规则错误说明公告", "6月18日手Q消息互通功能维护说明", "6月18日活动入口异常说明公告", "6月19日抢先服不停机更新公告", "6月18日体验服停机更新公告", "峡谷购物津贴活动开启公告", "天狼星小队集结！参与活动解锁伽罗KPL新皮肤6折", "晴日暖风暑气深，夏日派对礼缤纷", "抢先服新赛季更新，云缨登场好礼享不停", "“一元福利周”活动公告", "全国32强集结！一起见证下一支职业战队诞生！", "荣耀之巅，群英荟萃——第七届王者荣耀高校联赛总决赛圆满落幕", "南昌理工学院NLG战队全胜夺冠 第七届王者荣耀高校联赛圆满落幕", "第三届王者荣耀全国大赛城市赛道资格赛赛程", "荣耀已至，齐鲁大地将上演王者校园巅峰对决——第七届王者荣耀高校联赛总决赛即将开战"]
    const newsList = newsTitle.map(title => {
      const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
      return {
        categories: randomCats.slice(0, 2),
        title: title
      }
    })

    await Article.deleteMany()
    await Article.insertMany(newsList)

    res.send(newsList)
  })

  // 获取新闻数据 
  router.get('/news/list', async (req, res) => {
    // // 查找顶级分类
    // const parent = await Category.findOne({
    //   name: '新闻分类'
    // }).populate({
    //     path: 'children',
    //     populate: {
    //       path: 'newsList'
    //     }
    //   }).lean()
    const parent = await Category.findOne({
      name: '新闻分类'
    })
    // 使用聚合查询
    const cats = await Category.aggregate([
      // 过滤数据
      { $match: { parent: parent._id } },
      // 关联查询某个集合
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: 'categories',
          as: 'newsList',
        }
      },
      // 修改查询到的newsList的数量
      {
        $addFields: {
          newsList: { $slice: ['$newsList', 5] }
        }
      }
    ])
    // 热门的设置
    const subCats = cats.map(item => item._id)
    cats.unshift({
      name: '热门',
      newsList: await Article.find().where({
        categories: { $in: subCats }
      }).populate('categories').limit(5).lean()
    })
    // 循环处理热门分类的所属分类 catagoryName ，先遍历cats的5个分类，取出newsList再循环
    cats.map(cat => {
      cat.newsList.map(news => {
        // 如果分类的名称等于热门，则取数组news的其中一个里面的name,否则就是当前的分类名称
        news.categoryName = (cat.name === '热门') ? news.categories[0].name : cat.name
        return news
      })
      return cat
    })

    res.send(cats)
  })

  // 录入英雄数据
  router.get('/heroes/init', async (req, res) => {
    await Hero.deleteMany({})
    const heroesData = [
      {
        "name": "热门",
        "heroes": [
          {
            "name": "鲁班七号",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg"
          },
          {
            "name": "诸葛亮",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg"
          },
          {
            "name": "安琪拉",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg"
          },
          {
            "name": "妲己",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg"
          },
          {
            "name": "铠",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg"
          },
          {
            "name": "后羿",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg"
          },
          {
            "name": "瑶",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg"
          },
          {
            "name": "亚瑟",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"
          },
          {
            "name": "孙悟空",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"
          },
          {
            "name": "吕布",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"
          }
        ]
      },
      {
        "name": "战士",
        "heroes": [
          {
            "name": "赵云",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg"
          },
          {
            "name": "墨子",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg"
          },
          {
            "name": "钟无艳",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg"
          },
          {
            "name": "吕布",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"
          },
          {
            "name": "夏侯惇",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg"
          },
          {
            "name": "曹操",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/128/128.jpg"
          },
          {
            "name": "典韦",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg"
          },
          {
            "name": "宫本武藏",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/130/130.jpg"
          },
          {
            "name": "达摩",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg"
          },
          {
            "name": "老夫子",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg"
          },
          {
            "name": "关羽",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/140/140.jpg"
          },
          {
            "name": "程咬金",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg"
          },
          {
            "name": "露娜",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg"
          },
          {
            "name": "花木兰",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg"
          },
          {
            "name": "橘右京",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg"
          },
          {
            "name": "亚瑟",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"
          },
          {
            "name": "孙悟空",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"
          },
          {
            "name": "刘备",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/170/170.jpg"
          },
          {
            "name": "杨戬",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/178/178.jpg"
          },
          {
            "name": "雅典娜",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183.jpg"
          },
          {
            "name": "哪吒",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/180/180.jpg"
          },
          {
            "name": "铠",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg"
          },
          {
            "name": "苏烈",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg"
          },
          {
            "name": "梦奇",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg"
          },
          {
            "name": "裴擒虎",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg"
          },
          {
            "name": "狂铁",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/503/503.jpg"
          },
          {
            "name": "孙策",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg"
          },
          {
            "name": "李信",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/507/507.jpg"
          },
          {
            "name": "盘古",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/529/529.jpg"
          },
          {
            "name": "云中君",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg"
          },
          {
            "name": "曜",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/522/522.jpg"
          },
          {
            "name": "马超",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg"
          },
          {
            "name": "蒙恬",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg"
          },
          {
            "name": "夏洛特",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/536/536.jpg"
          },
          {
            "name": "司空震",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg"
          }
        ]
      },
      {
        "name": "法师",
        "heroes": [
          {
            "name": "小乔",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg"
          },
          {
            "name": "墨子",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg"
          },
          {
            "name": "妲己",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg"
          },
          {
            "name": "嬴政",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/110/110.jpg"
          },
          {
            "name": "高渐离",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg"
          },
          {
            "name": "孙膑",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg"
          },
          {
            "name": "扁鹊",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg"
          },
          {
            "name": "芈月",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg"
          },
          {
            "name": "周瑜",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg"
          },
          {
            "name": "甄姬",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg"
          },
          {
            "name": "武则天",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg"
          },
          {
            "name": "貂蝉",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg"
          },
          {
            "name": "安琪拉",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg"
          },
          {
            "name": "露娜",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg"
          },
          {
            "name": "姜子牙",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg"
          },
          {
            "name": "王昭君",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/152/152.jpg"
          },
          {
            "name": "张良",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/156/156.jpg"
          },
          {
            "name": "不知火舞",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg"
          },
          {
            "name": "钟馗",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg"
          },
          {
            "name": "诸葛亮",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg"
          },
          {
            "name": "干将莫邪",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/182/182.jpg"
          },
          {
            "name": "女娲",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/179/179.jpg"
          },
          {
            "name": "杨玉环",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg"
          },
          {
            "name": "弈星",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/197/197.jpg"
          },
          {
            "name": "米莱狄",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/504/504.jpg"
          },
          {
            "name": "司马懿",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg"
          },
          {
            "name": "沈梦溪",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/312/312.jpg"
          },
          {
            "name": "上官婉儿",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg"
          },
          {
            "name": "嫦娥",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg"
          },
          {
            "name": "西施",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/523/523.jpg"
          },
          {
            "name": "司空震",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg"
          }
        ]
      },
      {
        "name": "坦克",
        "heroes": [
          {
            "name": "廉颇",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg"
          },
          {
            "name": "庄周",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg"
          },
          {
            "name": "刘禅",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg"
          },
          {
            "name": "钟无艳",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg"
          },
          {
            "name": "白起",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg"
          },
          {
            "name": "芈月",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg"
          },
          {
            "name": "吕布",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"
          },
          {
            "name": "夏侯惇",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg"
          },
          {
            "name": "达摩",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg"
          },
          {
            "name": "项羽",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg"
          },
          {
            "name": "程咬金",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg"
          },
          {
            "name": "刘邦",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/149/149.jpg"
          },
          {
            "name": "亚瑟",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"
          },
          {
            "name": "牛魔",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg"
          },
          {
            "name": "张飞",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg"
          },
          {
            "name": "太乙真人",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg"
          },
          {
            "name": "东皇太一",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg"
          },
          {
            "name": "铠",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg"
          },
          {
            "name": "苏烈",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg"
          },
          {
            "name": "梦奇",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg"
          },
          {
            "name": "孙策",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg"
          },
          {
            "name": "盾山",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg"
          },
          {
            "name": "嫦娥",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg"
          },
          {
            "name": "猪八戒",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/511/511.jpg"
          },
          {
            "name": "蒙恬",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg"
          },
          {
            "name": "阿古朵",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg"
          }
        ]
      },
      {
        "name": "刺客",
        "heroes": [
          {
            "name": "赵云",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg"
          },
          {
            "name": "阿轲",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/116/116.jpg"
          },
          {
            "name": "李白",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg"
          },
          {
            "name": "貂蝉",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg"
          },
          {
            "name": "韩信",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg"
          },
          {
            "name": "兰陵王",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/153/153.jpg"
          },
          {
            "name": "花木兰",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg"
          },
          {
            "name": "不知火舞",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg"
          },
          {
            "name": "娜可露露",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/162/162.jpg"
          },
          {
            "name": "橘右京",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg"
          },
          {
            "name": "孙悟空",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"
          },
          {
            "name": "百里守约",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg"
          },
          {
            "name": "百里玄策",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/195/195.jpg"
          },
          {
            "name": "裴擒虎",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg"
          },
          {
            "name": "元歌",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/125/125.jpg"
          },
          {
            "name": "司马懿",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg"
          },
          {
            "name": "上官婉儿",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg"
          },
          {
            "name": "云中君",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg"
          },
          {
            "name": "马超",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg"
          },
          {
            "name": "镜",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/531/531.jpg"
          },
          {
            "name": "澜",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/528/528.jpg"
          }
        ]
      },
      {
        "name": "射手",
        "heroes": [
          {
            "name": "孙尚香",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg"
          },
          {
            "name": "鲁班七号",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg"
          },
          {
            "name": "马可波罗",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg"
          },
          {
            "name": "狄仁杰",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg"
          },
          {
            "name": "后羿",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg"
          },
          {
            "name": "李元芳",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/173/173.jpg"
          },
          {
            "name": "虞姬",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg"
          },
          {
            "name": "成吉思汗",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/177/177.jpg"
          },
          {
            "name": "黄忠",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/192/192.jpg"
          },
          {
            "name": "百里守约",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg"
          },
          {
            "name": "公孙离",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/199/199.jpg"
          },
          {
            "name": "伽罗",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg"
          },
          {
            "name": "蒙犽",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/524/524.jpg"
          },
          {
            "name": "艾琳",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/155/155.jpg"
          }
        ]
      },
      {
        "name": "辅助",
        "heroes": [
          {
            "name": "庄周",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg"
          },
          {
            "name": "刘禅",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg"
          },
          {
            "name": "孙膑",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg"
          },
          {
            "name": "牛魔",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg"
          },
          {
            "name": "张飞",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg"
          },
          {
            "name": "钟馗",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg"
          },
          {
            "name": "蔡文姬",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg"
          },
          {
            "name": "太乙真人",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg"
          },
          {
            "name": "大乔",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg"
          },
          {
            "name": "东皇太一",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg"
          },
          {
            "name": "鬼谷子",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg"
          },
          {
            "name": "明世隐",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg"
          },
          {
            "name": "盾山",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg"
          },
          {
            "name": "瑶",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg"
          },
          {
            "name": "鲁班大师",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/525/525.jpg"
          },
          {
            "name": "阿古朵",
            "avatar": "http://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg"
          }
        ]
      }
    ]

    for (let cat of heroesData) {
      if (cat.name === '热门') {
        continue
      }
      //找到当前分类在数据库中的位置
      const category = await Category.findOne({
        name: cat.name
      })
      cat.heroes = cat.heroes.map(hero => {
        hero.categories = [category]
        return hero
      })
      // 录入英雄
      await Hero.insertMany(cat.heroes)
    }

    res.send(await Hero.find())

  })

  // 获取英雄数据 
  router.get('/heroes/list', async (req, res) => {
    const parent = await Category.findOne({
      name: '英雄分类'
    })
    // 使用聚合查询
    const cats = await Category.aggregate([
      // 过滤数据
      { $match: { parent: parent._id } },
      // 关联查询某个集合
      {
        $lookup: {
          from: 'heroes',
          localField: '_id',
          foreignField: 'categories',
          as: 'heroList',
        }
      },
    ])
    // 热门的设置
    const subCats = cats.map(item => item._id)
    cats.unshift({
      name: '热门',
      heroList: await Hero.find().where({
        categories: { $in: subCats }
      }).limit(10).lean()
    })

    res.send(cats)
  })

  // 文章详情
  router.get('/articles', async (req, res) => {
    // console.log(req.query.id)
    const article = await Article.findById(req.query.id)
    res.send(article)
  })

  // 英雄详情
  router.get('/heroes', async (req, res) => {
    const hero = await Hero.findById(req.query.id).populate('categories items1 items2 partners.hero').lean()
    res.send(hero)
  })


  app.use('/web/api', router)
}