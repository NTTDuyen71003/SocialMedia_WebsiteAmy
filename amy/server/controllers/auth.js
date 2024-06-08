//Tạo và kiểm thử tài khoản đầu tiên

import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const regis=(req,res)=>{
    //kiểm tra user tồn tại ném lỗi
    const q="SELECT * FROM users WHERE userName=?";
    db.query(q,[req.body.userName],(err,data)=>{
        if(err) return res.status(500).json(err)
        if(data.length) return res.status(409).json("Người dùng đã tồn tại.")

        //tạo user mới và harsh pass
        const salt=bcrypt.genSaltSync(10);
        const harshPassword =bcrypt.hashSync(req.body.password,salt)
        const harshConfirmPassword =bcrypt.hashSync(req.body.confirmPassword,salt)
        const q="INSERT INTO users(`userName`,`name`,`email`,`phoneNumber`,`password`,`confirmPassword`) VALUE (?)"

        const values =[req.body.userName,req.body.name,req.body.email,req.body.phoneNumber,harshPassword,harshConfirmPassword]
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json("Người dùng đã được tạo.")
        });
    });
};


export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE userName = ?";
    const { userName, rememberMe } = req.body;

    db.query(q, [userName], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length == 0) return res.status(404).json("Không tìm thấy người dùng.");

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if (!checkPassword) return res.status(400).json("Sai tên tài khoản hoặc mật khẩu!");

        const token = jwt.sign({ id: data[0].id }, "secretkey");
        const { userName, email, phoneNumber, ...others } = data[0];

        if (rememberMe) {
            // Tạo cookie an toàn để ghi nhớ tài khoản
            res.cookie("rememberedUser", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });
        }

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true, // Đảm bảo secure khi dùng HTTPS
            sameSite: "none"
        }).status(200).json({ userName, email, phoneNumber, ...others });
    });
};



export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    });
    
    res.clearCookie("rememberedUser", {
        secure: true,
        sameSite: "none"
    });
    
    res.status(200).json("Người dùng này đã đăng xuất tài khoản");
};
