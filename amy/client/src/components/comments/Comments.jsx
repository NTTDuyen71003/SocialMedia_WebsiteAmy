import "./Comments.scss";
import { useContext, useState } from "react";
import defaultUserPic from "../../img/defaultUserPic.jpg";
import { Authcontext} from "../../context/AuthContext";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { Link,useLocation} from "react-router-dom";


const Comments = ({ postID }) => {

    const { currentUser } = useContext(Authcontext);
    const queryClient = useQueryClient();
    const [commentDesc,setDesc]=useState("")

    const { isPending, error, data } = useQuery({
        queryKey: ["comments"],
        queryFn: () =>
        makeRequest
            .get("/comments?postID=" + postID)
            .then((res) => {
            return res.data;
            }),
    });

    //Mutation v5 change
    //Định nghĩa và thay đổi giá trị comment
    const mutation = useMutation({
        mutationFn: (newComment) => {
          return makeRequest.post("/comments", newComment); // Sử dụng hàm mutationFn của bạn
        },
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['comments'] }); // Sử dụng key query của bạn
          setDesc(""); // Cập nhật lại giá trị của commonetDesc thành chuỗi rỗng
        },
    });


    const handleCkick= async (e)=>{
        e.preventDefault();
        mutation.mutate({commentDesc,postID});
        setDesc("") //trả mô tả về trống sau khi bình luận bài
    }


    console.log(data)

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
        
      // Sử dụng
    


    //dữ liệu mẫu
    // const comments=[
    //     {
    //         id:2,
    //         desc:"Ngáp tí cũng bị tế à",
    //         name:"Tén",
    //         userId:2,
    //         profilePic:AvaTen,
    //     },
    //     {
    //         id:3,
    //         desc:"Ọ,cưng dọ",
    //         name:"Quin Như Như",
    //         userId:3,
    //         profilePic:AvaNhu,
    //     },
    // ];

    //Lấy dữ liệu cập nhật cho username
    const { data: commentUserData } = useQuery({
      queryKey: ["comment-user"],
      queryFn: () =>
        makeRequest.get("/users/find/" + currentUser.id).then((res) => {
          return res.data;
        }),
  });

    return (
        <div className="comments">
        <div className="write">
            {commentUserData && (
              <img src={commentUserData.profilePic ? "/upload/images/" + commentUserData.profilePic : defaultUserPic} alt="" />
            )}
            <input type="text" placeholder="Viết bình luận" 
            value={commentDesc}
            onChange={(e)=>setDesc(e.target.value)}/>
            <button type="submit" onClick={handleCkick} disabled={!commentDesc}>Gửi</button>
        </div>
        {error
        ?"Lỗi thực thi tác vụ!"
        :isPending  
        ? "Đang tải..."
        : data.map((comment) => {
            // Chuyển đổi thời gian sang tiếng Việt cho từng comment
            const vietnameseTime = convertToVietnameseTime(comment.createdDate);

            return (
            <div className="comment" key={comment.id}>
              <Link to={`/profile/${comment.userID}`}style={{textDecoration:"none",color:"inherit"}} onClick={handleNavigateProfile}> 
                <img src={comment.profilePic ? "/upload/images/" + comment.profilePic : defaultUserPic} alt="" />
                </Link>
                <div className="info">
                <Link to={`/profile/${comment.userID}`}style={{textDecoration:"none",color:"inherit"}} onClick={handleNavigateProfile}> 
                    <span className="Name">{comment.name}</span>
                </Link>
                    <p>{comment.commentDesc}</p>
                    <span className="date">{vietnameseTime}</span>
                </div>
                
            </div>
            );
        })}
        </div>
    );
    };

export default Comments;