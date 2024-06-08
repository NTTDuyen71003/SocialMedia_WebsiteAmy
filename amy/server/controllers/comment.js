import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments=(req,res)=>{

    //lưu trữ bình luận những người có liên quan đến người dùng
        const q=
        `SELECT c.*, u.id AS userID, u.name, u.profilePic
        FROM comments AS c
        JOIN users AS u ON (u.id = c.userID)
        WHERE c.postID =?
        ORDER BY c.createdDate DESC`;
        

        db.query(q,[req.query.postID],(err,data)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json(data);
        });
};


export const addComment=(req,res)=>{

    //hiển thị bình luận những người có liên quan đến người dùng
    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Người dùng chưa đăng nhập!")
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Mã Token không hợp lệ!");

        const q=
        "INSERT INTO comments (`commentDesc`,`createdDate`,`userID`,`postID`) VALUES (?)";
        

        const values=[
            req.body.commentDesc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postID
        ]

        db.query(q,[values],(err,data)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json("Bình luận đã được tạo.");
        });
    });
};