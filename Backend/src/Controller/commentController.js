import prisma from "../Prisma/client.js";

export const createComment = async(req,res) => {
    try{
        const {message, taskId} = req.body

        const comment = await prisma.comment.create({
            data:{
                message,
                taskId,
                userId: req.user.id
            },
            include:{
                user: true,
            }
        })
        res.status(201).json(comment)
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

export const getComments = async(req,res) => {
    try{
        const {taskId} = req.params

        const comments = await prisma.comment.findMany({
            where:{
                taskId: Number(taskId)
            },
            include:{
                user:true
            },
            orderBy:{
                createdAt:"desc"
            }
        })
        res.status(201).json(comments)
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}