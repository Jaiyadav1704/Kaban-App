import express from "express"
import { getComments, createComment } from "../Controller/commentController.js"
import protect from "../middleware/authMiddleware.js"

const commentroute = express.Router()

commentroute.post("/create-comment", protect, createComment)
commentroute.get("/get-comments/:taskId", protect, getComments)

export default commentroute;