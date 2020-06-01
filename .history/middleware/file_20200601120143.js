const multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, cb) {

    }

    filename() {

    }
});
const fileFilter = (req, res, cb) => {

}
module.exports = multer({
    storage,
    fileFilter
});