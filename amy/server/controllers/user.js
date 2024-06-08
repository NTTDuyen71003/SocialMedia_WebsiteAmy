import {db} from "../connect.js";
import jwt from "jsonwebtoken";

//Lấy dữ liệu cho Profile
export const getUser = (req, res) => {
    const userID = req.params.userID;

    const q = `SELECT * FROM users WHERE id=?`;

    db.query(q, [userID], (err, data) => {
        if (err) return res.status(500).json(err);
        
        if (data && data.length > 0) {
            const { password, ...info } = data[0];
            return res.json(info);
        } else {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }
    });
}


//Update Profile
export const updateUser = (req, res) => {
    const token=req.cookies.accessToken;
    if(!token) return res.status(401).json("Người dùng chưa đăng nhập!")
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if(err) return res.status(403).json("Mã Token không hợp lệ!");

        const q= "UPDATE users SET `name`=?,`location`=?,`slogan`=?,`profilePic`=?,`background`=?,`fb`=?,`twitter`=?,`insta`=?,`tiktok`=?,`discord`=? WHERE id=?";

        db.query(q,[
            req.body.name,
            req.body.location,
            req.body.slogan,
            req.body.profilePic,
            req.body.background,
            req.body.fb,
            req.body.twitter,
            req.body.insta,
            req.body.tiktok,
            req.body.discord,
            userInfo.id
        ],(err,data)=>{
            if(err) res.status(500).json(err)
            if(data.affectedRows>0) return res.json("Đã cập nhật.")
            return res.status(403).json("Bạn chỉ có thể cập nhật trang của mình.")
        });
    });
};

//Lấy dữ liệu người dùng cho tìm kiếm
export const getAllUsers = (req, res) => {
    const q = `SELECT id,name,profilePic FROM users`;
  
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.json(data);
    });
};

