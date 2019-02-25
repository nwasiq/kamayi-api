const multer = require('multer');
const path = require('path');

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /xls|xlsx/;
    const allowedMimes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = allowedMimes[0] == file.mimetype || allowedMimes[1] == file.mimetype;
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only xls or xlsx file types allowed!');
    }
}

const tempStorageForXls = multer.diskStorage({
    destination: './public/',
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

module.exports = {
    uploadExcelFile: multer({
        storage: tempStorageForXls,
        limits: { fileSize: 10000000, files: 1 },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    }).single('excelFile')
};

