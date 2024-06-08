import "./Regis.scss"
import { Link,useNavigate } from "react-router-dom";
import { ImEye } from "react-icons/im";
import { ImEyeBlocked } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import { FaIdCardAlt } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight } from "react-icons/fa6";
import whiteline from "../../materials/white-outline.png"
import dots from "../../materials/dots.png"
import coin from "../../materials/coin.png"
import spring from "../../materials/spring.png"
import rocket from "../../materials/rocket.png"
import cloud from "../../materials/cloud.png"
import stars from "../../materials/stars.png"
import { useState } from "react";
import axios from "axios";


const Regis = () => 
{
    //Ràng buộc email
    const handleEmailChange = (event) => {
        let inputValue = event.target.value;
        let error = '';
      
        // Kiểm tra nếu giá trị nhập vào không phải là định dạng email
        if (inputValue && !/\b[A-Za-z0-9._%+-]+@gmail\.com\b/.test(inputValue)) 
        {
          error = 'Định dạng Email không hợp lệ';
        }
      
        // Cập nhật trạng thái lỗi
        setEmailError(error);
      
        // Nếu không có lỗi, cập nhật state inputs
        if (!error) 
        {
          setInputs(prev => ({ ...prev, email: inputValue }));
          setErr(''); // Xóa thông báo lỗi khi người dùng thay đổi giá trị trường dữ liệu
        }
    };


    //Hàm để xử lý việc nhập số điện thoại
    const handlePhoneNumberChange = (event) => {
        let inputValue = event.target.value;
      
        // Kiểm tra nếu giá trị nhập vào không phải là số hoặc độ dài lớn hơn 10
        if (!/^\d*$/.test(inputValue) || inputValue.length > 10) 
        {
          // Loại bỏ các ký tự không phải số khỏi giá trị nhập vào
          inputValue = inputValue.replace(/[^\d]/g, '');
          // Cắt giá trị nhập vào để chỉ giữ lại 10 ký tự
          inputValue = inputValue.slice(0, 10);
        }
      
        // Cập nhật giá trị mới vào phần tử input
        event.target.value = inputValue;
      
        // Cập nhật trạng thái lỗi và thông báo lỗi nếu cần
        if (inputValue.length !== 10) {
          setPhoneNumberError('Vui lòng nhập đúng 10 số');
        } else {
          setPhoneNumberError('');
        }
      
        // Cập nhật state inputs với giá trị số điện thoại đã xử lý
        setInputs(prev => ({ ...prev, phoneNumber: inputValue }));
        setErr(''); // Xóa thông báo lỗi khi người dùng thay đổi giá trị trường dữ liệu
    };
      

    //Hàm ẩn hiện pass
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [eyeIcon, setEyeIcon] = useState(<ImEyeBlocked className="eyeclose-icon" />);
    const [confirmEyeIcon, setConfirmEyeIcon] = useState(<ImEyeBlocked className="eyeclose-icon" />);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
        setEyeIcon(showPassword ? <ImEyeBlocked className="eyeclose-icon" /> : <ImEye className="eyeopen-icon" />);
    };
    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
        setConfirmEyeIcon(showConfirmPassword ? <ImEyeBlocked className="eyeclose-icon" /> : <ImEye className="eyeopen-icon" />);
    };


    //Hàm điều kiện các trường mật khẩu
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
      
        // Kiểm tra trường Xác nhận mật khẩu
        if (name === 'confirmPassword') {
          // Kiểm tra khớp với Mật khẩu
          if (value !== inputs.password) {
            setConfirmPasswordError('Xác thực mật khẩu sai');
          } else {
            setConfirmPasswordError('');
          }
        }
      
        setInputs((prev) => ({...prev,[name]: value.trim(),}));
        setErr(''); // Xóa thông báo lỗi khi người dùng thay đổi giá trị trường dữ liệu
    };
    

    //Trường dữ liệu
    const [inputs, setInputs] = useState({
        userName: "",
        name:"",
        email: "",
        phoneNumber:"",
        password: "",
        confirmPassword:""
    });
    

    //Lưu trữ state
    const [err, setErr] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate=useNavigate() /*chuyển đổi giữa các trang*/ 
    
    
    //Tạo tk
    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErr(''); // Xóa thông báo lỗi khi người dùng thay đổi giá trị trường dữ liệu
    };
    
    
    //Sự kiện nhấn nút đk tạo tk
    const handleRegis = async (e) => {
        e.preventDefault();
      
        // Kiểm tra xem tất cả các trường đều đã được điền
        if (
          !inputs.userName ||
          !inputs.name ||
          !inputs.email ||
          !inputs.phoneNumber ||
          !inputs.password ||
          !inputs.confirmPassword
        ) 
        {
          setErr("Vui lòng nhập đầy đủ thông tin");
          return;
        }
      
        try {
          await axios.post("http://localhost:8800/api/auth/regis", inputs);
          navigate("/login");
        } catch (err) {
          setErr(err.response.data);
        }
    };


    // console.log(err)

    return (
      <div id="Regis">
        <div className="regis-page">
            <div className="form-container-regis">
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
                      <Link to="/login">
                        <button className="btn btn-log">Đăng nhập</button>
                      </Link>  
                        <button className="btn btn-res" id="regis">Đăng ký</button>     
                    </div>

                    <div className="regis-form">
                        <div className="form-title">
                            <span>Đăng Ký</span>
                        </div>

                        <span style={{ color: '#cc4757',display:'flex',justifyContent:'center',fontWeight:'bold' }}>{err}</span>

                        <div className="form-inputs">
                            <div className="input-box">
                                <input type="text" className="input-field" placeholder="Tên tài khoản" name="userName" onChange={handleChange}/>
                                <FaUser className="icon"/>
                            </div>

                            <div className="input-box">
                                <input type='text' className="input-field"placeholder="Tên người dùng" name="name" onChange={handleChange}/>
                                <FaIdCardAlt className="icon"/>
                            </div>

                             {/* Ràng buộc email */}
                            <div className="input-box">
                                <input type='email' className="input-field" placeholder="Email" name="email" onChange={handleEmailChange} />
                                <span className="error-message">{emailError}</span>
                                <MdAttachEmail className="icon"/>                                                          
                            </div>
                            
                            
                            {/* Sự kiện onChange để check lỗi nhập số điện thoại */}
                            <div className="input-box">
                                <input type="text" className="input-field"  placeholder="Số điện thoại" name="phoneNumber" onChange={handlePhoneNumberChange} />
                                <FaPhoneVolume className="icon"/>
                                <span className="error-message">{phoneNumberError}</span>
                            </div>
                            
                            
                            <div className="input-box">
                                <input type={showPassword ? 'text' : 'password'} className="input-field"placeholder="Mật khẩu" name="password" onChange={handlePasswordChange}/> 
                                <span className="eye-icon icon" onClick={toggleShowPassword}>{eyeIcon}</span> 
                                <span id="error-message-long">{passwordError}</span>                          
                            </div>
                            

                            <div className="input-box">
                              <input type={showConfirmPassword ? "text" : "password"} className="input-field" placeholder="Xác nhận mật khẩu" name="confirmPassword"onChange={handlePasswordChange}/>
                              <span className="eye-icon icon" onClick={toggleShowConfirmPassword}>{confirmEyeIcon}</span>
                              <span className="error-message">{confirmPasswordError}</span>
                            </div>
                            
                            
                            <div className="input-box">
                                <button className="input-submit" onClick={handleRegis}>                               
                                    <span>Đăng ký</span><FaArrowRight />           
                                </button>
                                <hr/>
                            </div>                            
                        </div>
                        
                        <span id="otherLogin">Đăng ký bằng phương thức khác</span>
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
    );
};

export default Regis;
