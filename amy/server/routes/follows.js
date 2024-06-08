import express from "express";
import {getUserRelationships} from "../controllers/follow.js"


const router = express.Router();

router.get("/", getUserRelationships)

export default router;