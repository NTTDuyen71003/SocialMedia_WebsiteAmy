import "./Leftbar.scss"
import { IoHome } from "react-icons/io5";
import { BsPencilSquare } from "react-icons/bs";
import { BsPeopleFill } from "react-icons/bs";
import { IoBookmarks } from "react-icons/io5";
import { MdStars } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import defaultUserPic from "../../img/defaultUserPic.jpg";
import defaultUserBack from "../../img/defaultUserBack.jpg";
// import { RiMenuFill } from "react-icons/ri";
import { Authcontext } from "../../context/AuthContext"
import { useContext,useState} from "react"
import { Link,useLocation,useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import axios from "axios";


const Leftbar=()=>
{
    const{currentUser}=useContext(Authcontext);
    const userID=parseInt(useLocation().pathname.split("/")[2]);
    const navigate=useNavigate() /*chuyển đổi giữa các trang*/
    const [err,setErr] = useState(null);
    const location = useLocation();

    //Lấy dữ liệu cập nhật cho username
    const { data: leftbarUserData } = useQuery({
        queryKey: ["leftbar-user"],
        queryFn: () =>
          makeRequest.get("/users/find/" + currentUser.id).then((res) => {
            return res.data;
          }),
    });



    //tải lại trang
    const handleNavigate = (targetPageId) => 
    {
        const currentPage = window.location.pathname; // Lấy đường dẫn hiện tại
              
        if (currentPage === '/') {
            setTimeout(() => {
                window.location.reload(); // Tải lại trang cần hướng đến
           }, 0);
        }
        else if(userID !== targetPageId) //nếu đi từ profile này sang profile khác,load lại profile khác
        {
            setTimeout(() => {
                window.location.reload(); // Tải lại trang cần hướng đến
            }, 0);
        }
         else 
        {
            window.location.reload();
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();  
        try 
        {
            await axios.post("http://localhost:8800/api/auth/logout");
            navigate("/login");
        } catch (err) {
            if (err.response && err.response.data) {
                setErr(err.response.data); // Gán thông báo lỗi từ server vào state err
            } else {
                setErr("Đã xảy ra lỗi không xác định.");
            }
        }
    };
    console.log(err)

    // const handleToggleLeftbar = () => {
    //     setIsLeftbarOpen(!isLeftbarOpen);
    // };

    return (
      <>
      {!location.pathname.startsWith('/profile/') &&(
        <div className="leftbar">
          <div className="container">
            <div className="menu">
              {/* <RiMenuFill/> */}
              <div className="user-container">
                  <div className="user-grid">
                    {leftbarUserData && (
                      <>
                        <div className="user-background">
                          <img id="background" src={leftbarUserData.background ? "/upload/images/" + leftbarUserData.background : defaultUserBack} alt="" />
                        </div>
                        <div className="user-profile">
                          <img id="profilepic" src={leftbarUserData.profilePic ? "/upload/images/" + leftbarUserData.profilePic : defaultUserPic} alt="" />
                          <span>{leftbarUserData.name}</span>
                          <Link to={`/profile/${currentUser.id}`} onClick={handleNavigate}>
                            <button>Trang cá nhân</button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                  {/* <hr style={{ width: "80%", margin: "0 auto" }} /> */}
                  <div className="item">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleNavigate}>
                      <IoHome />
                      <span style={{ marginLeft: '20px', marginTop: "3px" }}>Trang chủ</span>
                    </Link>
                  </div>
                  <div className="item">
                    <BsPencilSquare />
                    <span>Tạo bài viết</span>
                  </div>
                  <div className="item">
                    <BsPeopleFill />
                    <span>Mọi người</span>
                  </div>
                  <div className="item">
                    <BsFillChatSquareDotsFill />
                    <span>Trò chuyện</span>
                  </div>
                  <div className="item">
                    <IoBookmarks />
                    <span>Bài viết đã lưu</span>
                  </div>
                  <div className="item">
                    <MdStars />
                    <span>Bài viết đã thích</span>
                  </div>
                  <div className="item" onClick={handleLogout}>
                      <RiLogoutCircleLine />
                      <span>Đăng xuất</span>
                    </div>
                  {/* <hr style={{ width: '80%', margin: 'auto' }} /> */}
            </div>
          </div>
        </div>
          )}
      </>
      );
};

export default Leftbar