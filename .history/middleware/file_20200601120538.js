const multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images');
    },

    filename(req, file, cb) {
        cb(null, new Date().toISOString + '-' + file.originalname)
    }
});
const fileFilter = (req, res, cb) => {

}
module.exports = multer({
    storage,
    fileFilter
});