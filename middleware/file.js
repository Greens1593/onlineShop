const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, './images/')
    },
    filename(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, callBack) => {
    if(allowedTypes.includes(file.mimetype)){
        callBack(null, true)
    } else {
        callBack(null, false)
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
})