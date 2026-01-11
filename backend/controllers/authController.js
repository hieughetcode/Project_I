const User = require("../models/User");
const jwt = require("jsonwebtoken");


//Tạo JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//Đăng ký
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    //Kiểm tra tính xác thực dữ liệu: thông tin không được để trống
    if(!fullName || !email || !password) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    try{
        //Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "Người dùng đã tồn tại" });
        }

        //Tạo người dùng mới
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
    }
};

//Đăng nhập
exports.loginUser = async (req, res) => {};

//Lấy thông tin người dùng
exports.getUserInfo = async (req, res) => {};