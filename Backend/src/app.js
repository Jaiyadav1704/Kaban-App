import express from "express"
import cors from "cors"
import prisma from "./Prisma/client.js"
import authroute from "./Route/authRoute.js"
import workroute from "./Route/workspaceRoute.js"
import boardroute from "./Route/boardRoute.js"
import columnroute from "./Route/columnRoute.js"
import taskroute from "./Route/taskRoute.js"
import commentroute from "./Route/commentRoute.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth",authroute)
app.use("/workspaces", workroute)
app.use("/boards", boardroute)
app.use("/columns", columnroute)
app.use("/tasks", taskroute)
app.use("/comments", commentroute)

app.get("/", async(req,res) => {
    const user = await prisma.user.findMany()

    res.json(users)
})


export default app;