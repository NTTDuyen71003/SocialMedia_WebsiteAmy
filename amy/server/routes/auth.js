import express from "express";
import {login,regis,logout} from "../controllers/auth.js";


const router = express.Router();


router.post("/login",login)
router.post("/regis",regis)
router.post("/logout",logout)

export default router;