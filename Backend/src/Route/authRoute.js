import express from "express"
import { register, login, getUsers } from "../Controller/authController.js";
import protect from "../middleware/authMiddleware.js"


const authroute = express.Router()


authroute.post("/register", register)
authroute.post("/login", login)
authroute.get("/get-users",protect, getUsers)
export default authroute;