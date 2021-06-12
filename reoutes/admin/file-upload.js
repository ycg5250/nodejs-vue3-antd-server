

const express = require('express')

const multer = require('multer')
const upload = multer({ dest: __dirname + '/../../public/uploads' })

const routerFile = express.Router()


// 上传图片
routerFile.post('/upload', upload.single('avatar'), async (req, res) => {
  // console.log('post')
  const file = req.file
  file.url = `http://localhost:8000/public/uploads/${file.filename}`
  res.send(file)
})


module.exports = routerFile

