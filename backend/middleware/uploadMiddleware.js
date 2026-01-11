const multer = require('multer');

//Cấu hình lưu trữ khi upload file ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.orginalName}`);
    },
});

//Lọc file
const fileFilter = (req, file, cb) => {
    const allowTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhập file ảnh dưới dạng .jpeg, .jpg và .png'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;