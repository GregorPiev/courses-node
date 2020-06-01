const multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, cb) {

    }
});
const fileFilter = (req, res, cb) => {

}
module.exports = multer({
    storage,
    fileFilter
});