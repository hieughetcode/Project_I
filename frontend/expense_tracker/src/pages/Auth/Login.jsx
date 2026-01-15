import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { updateUser } = useContext(UserContext);

    const navigate = useNavigate();

    //Xử lý đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)) {
            setError("Vui lòng nhập địa chỉ email hợp lệ!");
            return;
        }

        if(!password) {
            setError("Vui lòng nhập mật khẩu!");
            return;
        }

        setError("");

        //Gọi tới API đăng nhập
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });
            const {token, user} = response.data;

            if(token) {
                localStorage.setItem("token", token);
                updateUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            if(error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Điều gì đó lỗi ở đây, vui lòng thử lại.");
            }
        }
    };


    return (
    <AuthLayout>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-black">Chào mừng bạn quay trở lại</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
                Vui lòng điền thông tin đăng nhập của bạn xuống bên dưới
            </p>

            <form onSubmit={handleLogin}>
                <Input
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    label="Địa chỉ Email"
                    placeholder="meomeo04@gmail.com"
                    type="text"
                />

                <Input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    label="Mật khẩu"
                    placeholder="Vui lòng nhập ít nhất 8 ký tự"
                    type="password"
                />

                {error && <p className="text-red-500">{error}</p>}

                <button type = "submit" className="btn-primary">
                    Đăng nhập
                </button>

                <p className="text-[13px] text-slate-800 mt-3">
                    Bạn chưa có tài khoản?{" "}
                    <Link className="font-medium text-primary underline" to ="/signup">
                        Đăng ký
                    </Link>
                </p>
            </form>
        </div>    
    </AuthLayout>
    );
};

export default Login;