import "./Login.scss";
import { FaUser } from "react-icons/fa";
import { ImEye } from "react-icons/im";
import { ImEyeBlocked } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight } from "react-icons/fa6";
import React from "react";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useContext} from 'react';
import { Authcontext } from "../../context/AuthContext";
import whiteline from "../../materials/white-outline.png"
import dots from "../../materials/dots.png"
import coin from "../../materials/coin.png"
import spring from "../../materials/spring.png"
import rocket from "../../materials/rocket.png"
import cloud from "../../materials/cloud.png"
import stars from "../../materials/stars.png"


const Login=()=>
{
    const [inputs, setInputs] = useState({
        userName: "",
        password: ""
    });
    

    //Lưu trữ state
    const [err, setErr] = useState(null);
    const navigate=useNavigate() /*chuyển đổi giữa các trang*/ 


    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErr(''); // Xóa thông báo lỗi khi người dùng thay đổi giá trị trường dữ liệu
    };

    //Hàm ẩn hiện pass
    const [showPassword, setShowPassword] = useState(false);
    const [eyeIcon, setEyeIcon] = useState(<ImEyeBlocked className="eyeclose-icon" />);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
        setEyeIcon(showPassword ? <ImEyeBlocked className="eyeclose-icon" /> : <ImEye className="eyeopen-icon" />);
    };


    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
      
        // Kiểm tra trường Mật khẩu
        if (name === 'password') {
          // Kiểm tra điều kiện của Mật khẩu
          if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(value)) {
            setPasswordError('Ít nhất 8 ký tự,bao gồm số và chữ in hoa');
          } else {
            setPasswordError('');
          }
        }   
        setInputs((prev) => ({...prev,[name]: value.trim(),}));
        setErr(''); // Xóa thông báo lỗi khi người dùng thay đổi giá trị trường dữ liệu
    };


    const {login}=useContext(Authcontext);
    const [passwordError, setPasswordError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
      
        // Kiểm tra xem tất cả các trường đều đã được điền
        if (
          !inputs.userName ||
          !inputs.password
        ) 
        {
          setErr("Vui lòng nhập đầy đủ thông tin");
          return;
        }
      
        try 
        {
            await login(inputs);
            navigate("/");
        } catch (err) {
            if (err.response && err.response.data) {
                setErr(err.response.data); // Gán thông báo lỗi từ server vào state err
            } else {
                setErr("Đã xảy ra lỗi không xác định.");
            }
        }
    };


    //Ghi nhớ tài khoản
    const handleRememberMe = (e) => {
        const isChecked = e.target.checked;
        setInputs({ ...inputs, rememberMe: isChecked });
    };



    return(
    <div id="Login">
        <div className="login-page">
            <div className="form-container">
                <div className="left">
                    <h1>AMY</h1>
                    <div className="img-layout">
                        <img src={whiteline} className="form-image-main" alt=""/>
                        <img src={dots} className="form-image dots" alt=""/>
                        <img src={coin} className="form-image coin" alt=""/>
                        <img src={spring} className="form-image spring" alt=""/>
                        <img src={rocket}className="form-image rocket" alt=""/>
                        <img src={cloud} className="form-image cloud" alt=""/>
                        <img src={stars} className="form-image stars" alt=""/>             
                    </div>
                    <div className="slogan">
                        <p>Nơi hội tụ những con người chung lý tưởng cao đẹp</p>
                    </div>
                </div>

                <div className="right">
                    <div className="btn-box">
                        <button className="btn btn-log">Đăng nhập</button>
                        <Link to="/regis">
                            <button className="btn btn-res">Đăng ký</button>
                        </Link> 
                    </div>

                    <div className="login-form">
                        <div className="form-title">
                            <span>Đăng Nhập</span>
                        </div>

                        <span style={{ color: '#cc4757',fontWeight:'bold' }}>{err}</span>

                        <div className="form-inputs">
                            <div className="input-box">
                                <input type="text" className="input-field" placeholder="Tên người dùng" name="userName" onChange={handleChange}/>
                                <FaUser className="icon"/>
                            </div>

                            <div className="input-box">
                                <input type={showPassword ? 'text' : 'password'} className="input-field" placeholder="Mật khẩu" name="password" onChange={handlePasswordChange}/>
                                <span className="eye-icon icon" onClick={toggleShowPassword}>{eyeIcon}</span>
                            </div>
                            {passwordError && <span className="error-message">{passwordError}</span>}


                            <div id="sub">                             
                                <label htmlFor="rememberMe"><input type="checkbox" id="rememberMe" onChange={handleRememberMe} />
                                    Ghi nhớ đăng nhập</label>

                                <div className="forgot-pass">
                                    {/* <a href="#">Quên mật khẩu?</a>*/}<span>Quên mật khẩu?</span>
                                </div>
                            </div>

                            
                            <div className="input-box">
                                <button className="input-submit" onClick={handleLogin}>                               
                                    <span>Đăng nhập</span><FaArrowRight />           
                                </button>
                            </div>
                            <hr style={{ marginTop: '20px' }}/>
                        </div>

                        <span id="otherLogin">Đăng nhập bằng phương thức khác</span>
                        <div className="social-login">
                            <div className="boxIcon">
                                <FcGoogle className="iconG"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Login