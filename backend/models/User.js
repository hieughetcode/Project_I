const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
    {
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profileImageUrl: {type: String, default: null}
    },
    { timestamps: true }
);

//Hashing mật khẩu trươc khi lưu vào DB
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//So sánh mật khẩu
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
