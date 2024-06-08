import "./Navbar.scss"
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import SavedSearchOutlinedIcon from '@mui/icons-material/SavedSearchOutlined';
import Logo from "../../img/Amy.png";
import { FaSun } from "react-icons/fa";
import { BsFillMoonStarsFill } from "react-icons/bs";
// import { RiMenuFill } from "react-icons/ri";
import defaultUserPic from "../../img/defaultUserPic.jpg";
import {Link,useLocation} from "react-router-dom"
import { DarkmodeContext } from "../../context/Darkmodecontext";
import React, { useContext,useState } from 'react';
import { Authcontext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";






const Navbar=()=>
{
    const {toggle,darkMode} = useContext(DarkmodeContext); //chuyển darkmode
    const{currentUser}=useContext(Authcontext);
    //Lưu trữ state
    const userID=parseInt(useLocation().pathname.split("/")[2]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showUserList, setShowUserList] = useState(false);


    //tải lại trang
    const handleNavigate = (targetPageId) => 
    {
        const currentPage = window.location.pathname; // Lấy đường dẫn hiện tại
              
        if (currentPage !== '/') {
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

    //Lấy dữ liệu cập nhật cho username
    const { data: navbarUserData } = useQuery({
        queryKey: ["navbar-user"],
        queryFn: () =>
          makeRequest.get("/users/find/" + currentUser.id).then((res) => {
            return res.data;
          }),
    });

    //Search
    const { data: users} = useQuery({
        queryKey:["users"], 
        queryFn:() =>
        makeRequest.get("/users").then((res) => res.data)
        }
    );
    const filteredUsers = users
    ? users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) && user.id !== currentUser.id
        )
    : [];
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setShowUserList(e.target.value.trim() !== '');
    };

    return(
        <div className='navbar'>
            <div className="left">
            {/* <RiMenuFill style={{marginRight:'20px'}}/> */}
            <Link to="/" style={{textDecoration:"none"}} onClick={handleNavigate}>
                <img src={Logo} alt="Amy"/>  
                <span id="title">AMY</span>
                </Link>          
            </div>

            <div className="center">
                <div className="search">
                    <SavedSearchOutlinedIcon style={{fontSize:'25px',marginRight:'5px'}}/>
                    <input type="text"placeholder="Tìm kiếm..."value={searchTerm}onChange={handleSearch}/>
                    {showUserList && filteredUsers.length > 0 && (
                        <div className="user-list-container">
                        <div className="user-list">
                            {filteredUsers.map((search) => (
                            <Link
                                to={`/profile/${search.id}`}
                                style={{ textDecoration: "none", color: "inherit" }}
                                onClick={handleNavigate}
                                key={search.id}>
                                <div className="user-item">
                                    <img src={search.profilePic ? "/upload/images/" + search.profilePic : defaultUserPic} alt={search.name} />
                                    <span>{search.name}</span>
                                </div>
                            </Link>
                            ))}
                        </div>
                        </div>
                    )}
                </div> 
            </div>

            <div className="right">            
            {darkMode ? 
                    (
                        <FaSun onClick={toggle} className="icon" />
                    ) : (
                        <BsFillMoonStarsFill onClick={toggle} className="icon" />
                    )}
                <NotificationsActiveOutlinedIcon className="icon"style={{ fontSize: "25px", cursor: "pointer" }} />
                <div className="user">
                {navbarUserData && ( <Link to={`/profile/${currentUser.id}`} style={{textDecoration:'none'}} onClick={handleNavigate}>
                    <img src={navbarUserData.profilePic ? "/upload/images/" + navbarUserData.profilePic : defaultUserPic} id="imgUser"alt=""style={{cursor:'pointer'}}/>
                </Link>
                )}                
                </div>  
           </div>
        </div>
    );
};

export default Navbar