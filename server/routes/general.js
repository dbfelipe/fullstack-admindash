import express from "express"
import { getUser, getDashboardStats } from "../controllers/general.js"


const router = express.Router();

router.get("/user/:id", getUser);
router.get("/dashboard", getDashboardStats);

{/**this user/:id is linked to  " const {id} = req.params;"  in controllers*/}



export default router;