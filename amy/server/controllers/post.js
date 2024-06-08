//Lấy dữ liệu post từ db MySQL đẩy lên
import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

//Dòng Select phải nhập đúng,ko thui lỗi 500 (Internal Server Error)
export const getPosts=(req,res)=>{

    //lọc bài viết cá nhân
    const userID=req.query.userID;

    //lưu trữ và hiển thị thông tin những người có liên quan đến người dùng
    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Người dùng chưa đăng nhập!")
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Mã Token không hợp lệ!");

        //check điều kiện,lọc full bài viết cho trang chủ và bài viết cá nhân cho trang cá nhân
        const q= userID !== "undefined"
        //lọc bài viết cá nhân
        ?`SELECT p.*, u.id AS userID, u.name, u.profilePic
        FROM posts AS p 
        JOIN users AS u ON (u.id = p.userID)
        WHERE p.userID = ? ORDER BY p.createdDate DESC`

        :`SELECT p.*, u.id AS userID, u.name, u.profilePic
        FROM posts AS p 
        JOIN users AS u ON (u.id = p.userID)
        LEFT JOIN relationships AS r ON (p.userID = r.followedUserID) WHERE r.followerUserID=? OR p.userID=?
        ORDER BY p.createdDate DESC`;
        
        /*Nếu mún lọc bài viết cho mỗi người dùng theo dõi,thêm dòng này
        LEFT JOIN relationships AS r ON (p.userID = r.followedUserID) WHERE r.followerUserID=? OR p.userID=?*/
        

        const values= userID !== "undefined"? [userID]:[userInfo.id,userInfo.id];

        db.query(q,values,(err,data)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};


export const addPost = (req, res) => {
    // Lưu trữ, đăng bài và hiển thị thông tin những người có liên quan đến người dùng
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Người dùng chưa đăng nhập!");
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Mã Token không hợp lệ!");
    
        const q = "INSERT INTO posts (`postDesc`,`img`,`video`,`createdDate`,`userID`) VALUES (?)";
        const values = [
            req.body.postDesc || '',
            req.body.img || '',
            req.body.video || '',
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ];
     
        db.query(q,[values],(err,data)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json("Bài viết đã được tạo.");
        });
    });
};


//Xóa bài viết
export const deletePost=(req,res)=>{

    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Người dùng chưa đăng nhập!")
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Mã Token không hợp lệ!");

        const q=
        "DELETE FROM posts WHERE `id`=? AND `userID`=?";
        
        db.query(q,[req.params.id,userInfo.id],(err,data)=>{
            if(err)return res.status(500).json(err);
            if(data.affectedRows>0) return res.status(200).json("Bài viết đã được xóa.");
            return res.status(403).json("Bạn chỉ có thể xóa bài viết của mình")
        });
    });
};