// users.js
import express from "express";
import {getUser,updateUser, getAllUsers} from "../controllers/user.js"


const router = express.Router();
// router.get("/test", (req, res) => {
//   res.send("Hoạt động rồi");
// });

router.get("/", getAllUsers)
router.get("/find/:userID", getUser)
router.put("/",updateUser)

export default router;