import express from "express"
import { createTask,getTask,updateTask,deleteTask,moveTask } from "../Controller/taskController.js"
import protect from "../middleware/authMiddleware.js"

const taskroute = express.Router()


taskroute.post("/create-task", protect,createTask)
taskroute.get("/get-tasks/:columnId", protect,getTask)
taskroute.put("/update-task/:taskId", protect,updateTask)
taskroute.delete("/delete-task/:taskId", protect, deleteTask)
taskroute.put("/move-task/:taskId", protect, moveTask)

export default taskroute;