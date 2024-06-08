import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes=(req,res)=>{

    //hiển thị cảm xúc của những người có liên quan đến người dùng
        const q=
        `SELECT userID FROM likes WHERE postID=?`        

        db.query(q,[req.query.postID],(err,data)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json(data.map(like=>like.userID));
        });
};


export const addLike=(req,res)=>{

    //thêm cảm xúc
    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Người dùng chưa đăng nhập!")
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Mã Token không hợp lệ!");

        const q=
        "INSERT INTO likes (`userID`,`postID`) VALUES (?)";
        

        const values=[
            userInfo.id,
            req.body.postID
        ]

        db.query(q,[values],(err)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json("Bài viết đã được yêu thích");
        });
    });
};


export const deleteLike=(req,res)=>{

    //xóa cảm xúc
    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Người dùng chưa đăng nhập!")
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Mã Token không hợp lệ!");

        const q=
        "DELETE FROM likes WHERE `userID`=? AND `postID`=?";
        

        db.query(q,[userInfo.id,req.query.postID],(err)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json("Bài viết đã được xóa yêu thích");
        });
    });
};