import express, { Router } from "express"
import { createWorkspace, getUserWorkspace, getSingleWorkspace, deleteWorkspace, addWorkspaceMember, getWorkspaceMembers, removeWorkspaceMember } from "../Controller/workspaceController.js"
import protect from "../Middleware/authMiddleware.js"


const workroute = express.Router()

workroute.post("/create-workspace", protect, createWorkspace)
workroute.get("/get-workspace", protect, getUserWorkspace)
workroute.get("/get-workspace/:workspaceId", protect, getSingleWorkspace)
workroute.post("/add-member/:workspaceId", protect, addWorkspaceMember)
workroute.get("/get-members/:workspaceId", protect, getWorkspaceMembers)
workroute.delete("/remove-member/:workspaceId/:userId", protect, removeWorkspaceMember)
workroute.delete("/delete-workspace/:workspaceId", protect, deleteWorkspace)

export default workroute;