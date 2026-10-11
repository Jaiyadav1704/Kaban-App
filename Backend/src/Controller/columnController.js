import prisma from "../Prisma/client.js";

export const createColumn = async(req,res) => {
    try{
        const {title, position, boardId} = req.body

        const column = await prisma.column.create({
            data:{
                title,
                position,
                boardId
            }
        })

        res.status(201).json(column)
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

export const getColumn = async(req,res) => {
    try{
        const {boardId} = req.params

        const columns = await prisma.column.findMany({
            where : {
                boardId: Number(boardId)
            }, 
            orderBy:{
                position:"asc"
            }
        })

        res.status(201).json(columns)
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}