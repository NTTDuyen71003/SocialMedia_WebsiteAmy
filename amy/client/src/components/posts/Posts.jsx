import "./Posts.scss";
import Post from "../post/Post.jsx"
// import NhaoNhao from "../../img/TromeocuaNhao.jpg"
// import Nhaochos from "../../img/NhaoNhao.jpg"
// import Tomtom from "../../img/PostTomTom.jpg"
import {useQuery} from '@tanstack/react-query'
import { makeRequest } from "../../axios.js";


const Posts=({userID})=>
{
    //dữ liệu mẫu bài viết
    // const posts=[
    //     {
    //         id:1,
    //         name:"Duyên Duyên",
    //         userId:1,
    //         profilePic:Nhaochos,
    //         desc:"Thằng trai út nhà tui lại làm trò mèo nữa rùi",
    //         img:NhaoNhao,
    //     },
        
    //     {
    //         id:2,
    //         name:"Duyên Duyên",
    //         userId:1,
    //         profilePic:Nhaochos,
    //         desc:"Nhão và người bạn Tom Tom của mình",
    //         img:Tomtom,
    //     },  
    // ];

    //lọc bài viết 
    const { isPending, error, data } = useQuery({
        queryKey: ['posts'],
        queryFn: () =>
           makeRequest.get("/posts?userID="+userID).then((res)=>{
            return res.data;
        })
    });


    console.log(data)

    //Đẩy bài viết lên layout 
    return (
        <div className="posts">
          {error
            ? "Lỗi thực thi tác vụ! Vui lòng đăng nhập trước."
            : isPending
            ? "Đang tải..."
            : data.map((post) => <Post post={post} key={post.id} />)}
        </div>
    );
};

export default Posts;