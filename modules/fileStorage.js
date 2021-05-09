const multer = require('multer')
const moment = require('moment')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS')

    // Достаём расширение файла
    let index = -1
    for (let i = file.originalname.length - 1; i !== 0; i--) {
      if (file.originalname[i] === '.') index = i
    }
    let extension = file.originalname.substring(index)

    cb(null, date + extension)
    
  }
})
 
export default multer({ storage })