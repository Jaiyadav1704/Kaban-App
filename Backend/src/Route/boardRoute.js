import express from "express"
import { createBoard, getBoards, deleteBoard , getSingleBoard} from "../Controller/boardController.js"
import protect from "../Middleware/authMiddleware.js"

const boardroute = express.Router()

boardroute.post("/create-board", protect,createBoard)
boardroute.get("/get-board/:workspaceId", protect, getBoards)
boardroute.delete("/delete-board/:boardId", protect,deleteBoard)
boardroute.get("/get-single-board/:boardId", protect, getSingleBoard)

export default boardroute;