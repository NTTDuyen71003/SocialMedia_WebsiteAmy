import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships=(req,res)=>{

    //lấy dữ liệu theo dõi của những người có liên quan đến người dùng
        const q=
        `SELECT u.id AS followerUserID,followedUserID, u.name, u.profilePic
        FROM relationships AS r
        JOIN users AS u ON (u.id = r.followerUserID)
        WHERE r.followedUserID = ?`
        
        

        db.query(q,[req.query.followedUserID],(err,data)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json(data.map(relationship=>relationship.followerUserID));
        });
};



export const addRelationship=(req,res)=>{

    //thêm quan hệ
    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Người dùng chưa đăng nhập!")
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Mã Token không hợp lệ!");

        const q=
        "INSERT INTO relationships (`followerUserID`,`followedUserID`) VALUES (?)";
        

        const values=[
            userInfo.id,
            req.body.userID
        ]

        db.query(q,[values],(err)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json("Đang theo dõi");
        });
    });
};


export const deleteRelationship=(req,res)=>{

    //xóa quan hệ
    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Người dùng chưa đăng nhập!")
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Mã Token không hợp lệ!");

        const q=
        "DELETE FROM relationships WHERE `followerUserID`=? AND `followedUserID`=?";
        

        db.query(q,[userInfo.id,req.query.userID],(err)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json("Hủy theo dõi");
        });
    });
};