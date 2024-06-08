//Bài viết

import "./Post.scss"
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { FaDeleteLeft } from "react-icons/fa6";
import defaultUserPic from "../../img/defaultUserPic.jpg";
import { Link,useLocation } from "react-router-dom";
import React, { useContext, useState } from 'react';
import Comments from "../comments/Comments";
import { useQuery,useQueryClient,useMutation} from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { Authcontext } from "../../context/AuthContext.js";



const Post=({post})=>
{
    const[commentOpen,setCommentOpen]=useState(false);
    const[menuOpen,setMenuOpen]=useState(false)
    const {currentUser}=useContext(Authcontext);
    const queryClient = useQueryClient();
    

    // Hàm chuyển đổi thời gian sang tiếng Việt
    function convertToVietnameseTime(dateString) {
      const date = new Date(dateString);
      const now = new Date(); // Thời gian hiện tại
      
      const millisecondsAgo = now.getTime() - date.getTime();
      
      if (millisecondsAgo < 60000) { // 60,000 milliseconds = 1 phút
        return "0 giây trước";
      } else {
        const minutesAgo = Math.floor(millisecondsAgo / 60000);
        if (minutesAgo < 60) {
          return `${minutesAgo} phút trước`;
        } else if (minutesAgo < 1440) {
          const hoursAgo = Math.floor(minutesAgo / 60);
          return `${hoursAgo} giờ trước`;
        } else {
          const daysAgo = Math.floor(minutesAgo / 1440);
          if (daysAgo === 1) {
            return "Hôm qua";
          } else if (daysAgo < 7) {
            return `${daysAgo} ngày trước`;
          } else {
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            return formattedDate;
          }
        }
      }
    }
      
    // Sử dụng
    const vietnameseTime = convertToVietnameseTime(post.createdDate);


    //dữ liệu mẫu
    // const star=true;


    const { isPending,data } = useQuery({
        queryKey: ['likes',post.id],
        queryFn: () =>
           makeRequest.get("/likes?postID="+post.id).then((res)=>{
            return res.data;
        })
    });


    // console.log(data)

    //Định nghĩa và thay đổi giá trị like
    const mutation = useMutation({
        mutationFn: (liked) => {
            if(liked)return makeRequest.delete("/likes?postID="+ post.id); // Sử dụng hàm mutationFn của bạn
            return makeRequest.post("/likes", {postID:post.id});
        },
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['likes'] }); // Sử dụng key query của bạn
        },
    });


    //Đếm like
    const handleLike=()=>
    {
        mutation.mutate(data?.includes(currentUser.id))
    }


    //Định nghĩa và xóa bài viết
    const deleteMutation = useMutation({
        mutationFn:(postID) => {
          return makeRequest.delete("/posts/" + postID);
        },       
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["posts"]);
          },
    });


    
    const handleDelete=()=>
    {
        deleteMutation.mutate(post.id);
    }


    // Sử dụng useQuery để lấy số lượng comments
    const { isPending:rIsPending, data:commentData } = useQuery({
        queryKey: ["comments", post.id], // Key query là ["comments", post.id]
        queryFn: () =>
        makeRequest.get("/comments?postID=" + post.id).then((res) => {
            return res.data;
        }),
    });


    const userID=parseInt(useLocation().pathname.split("/")[2]);
    //tải lại trang
    const handleNavigateProfile = (targetPageId) => {
        const currentPage = window.location.pathname; // Lấy đường dẫn hiện tại
        
        if (currentPage === '/') {
          setTimeout(() => {
            window.location.reload(); // Tải lại trang cần hướng đến
          }, 0);
        } else if (userID !== targetPageId) {
          // Thực hiện tải lại trang khi id của trang hiện tại khác với id của trang muốn chuyển đến
          setTimeout(() => {
            window.location.reload(); // Tải lại trang cần hướng đến
          }, 0);
        }
    };




    return(
        <div className='post'>
            <div className="container">
            <div className="user">
                <div className="userInfo">
                    <img src={post.profilePic ? "/upload/images/" + post.profilePic : defaultUserPic} alt=""/>
                    <div className="details">
                        {/* Dẫn qua trang profile cá nhân */}
                        <Link to={`/profile/${post.userID}`}style={{textDecoration:"none",color:"inherit"}} onClick={handleNavigateProfile}> 
                            <span className="name">{post.name}</span>
                        </Link>                            
                        <span className="date">{vietnameseTime}</span>
                    </div>
                </div>
                {/* Event xóa bài viết */}
                <MoreHorizOutlinedIcon className="menuIcon" onClick={()=>setMenuOpen(!menuOpen)}/>
                {menuOpen && post.userID===currentUser.id && (<button onClick={handleDelete} ><FaDeleteLeft id="deletePostbtn"/>
                    Xóa bài viết</button>)}
            </div>      
                <div className="content">
                    <p>{post.postDesc}</p>
                    {/* Đẩy ảnh từ upload lên trang chính */}
                    <img src={"/upload/images/"+post.img} alt=""/>
                    {post.video && <video src={"/upload/videos/" + post.video} controls />} 
                </div>
                <div className="info">
                <div className="item" onClick={handleLike}>
                    {isPending? (
                    "Đang tải...")
                    : data?.includes(currentUser.id) ? 
                    (<StarRateRoundedIcon style={{ color: "orange" }}/>) : (<StarOutlineRoundedIcon/>)}
                    {data?.length}
                </div>
                <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                    {rIsPending ? (
                        "Đang tải..."
                    ) : commentData?.includes(currentUser.id)}
                    <ReviewsOutlinedIcon/>{commentData?.length}
                </div>
                <div className="item">
                    <ShareOutlinedIcon/>
                    0
                </div>
            </div>      
            </div> 
            {commentOpen && <Comments postID={post.id}/>} 
            <hr/> 
        </div>
    );
};

export default Post;