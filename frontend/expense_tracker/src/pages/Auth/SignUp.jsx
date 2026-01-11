import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    //Hàm xử lý đăng ký
    const handleSignUp = async (e) => {
        e.preventDefault();

        let profileImageUrl = "";

        if(!fullName) {
            setError("Vui lòng nhập họ và tên!");
            return;
        }

        if(!validateEmail(email)) {
            setError("Vui lòng nhập địa chỉ email hợp lệ!");
            return;
        }

        if(!password) {
            setError("Vui lòng nhập mật khẩu!");
            return;
        }

        setError("");

        //Gọi tới API đăng ký
    }
    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Tạo tài khoản</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Hãy tham gia cùng chúng mình bằng cách điền thông tin xuống bên dưới nhé!
                </p>

                <form onSubmit={handleSignUp}>
                    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            label="Họ và tên"
                            placeholder="Nguyễn Văn A"
                            type="text"
                        />

                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Địa chỉ Email"
                            placeholder="meomeo04@gmail.com"
                            type="text"
                        />
                    <div className="col-span-2">
                        <Input
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                            label="Mật khẩu"
                            placeholder="Vui lòng nhập ít nhất 8 ký tự"
                            type="password"
                        />
                    </div>
                    </div>

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button type="submit" className="btn-primary">
                        Đăng ký
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        Bạn đã có tài khoản?{" "}
                        <Link className="font-medium text-primary underline" to="/login">
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
}

export default SignUp;