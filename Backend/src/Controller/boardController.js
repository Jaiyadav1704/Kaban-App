import prisma from "../Prisma/client.js";

export const createBoard = async(req,res) => {
    try{
        const {title, workspaceId} = req.body

        const board = await prisma.board.create({
            data: {
                title,
                workspaceId,
                columns:{
                    create:[
                        {
                            title:"Todo",
                            position:1
                        },
                        {
                            title:"Doing",
                            position:2
                        },
                        {
                            title:"Done",
                            position:3
                        }
                    ]
                }
            },

            include:{
                columns:true
            }
        })

        res.status(201).json(board)
    }catch(err){
        console.log(err)

        res.status(500).json({
            message:err.message
        })
    }
}

export const getBoards = async(req,res) => {
    try{
        const {workspaceId} = req.params

        const boards = await prisma.board.findMany({
            where:{
                workspaceId: Number(workspaceId)
            }, include:{
                columns:{
                    include:{
                        _count: {
                            select:{
                                tasks:true
                            }
                        }
                    }
                }
            }
        })
        const boardsWithTaskCount = boards.map((board) => ({
            ...board,
            taskCount: board.columns.reduce(
                (total, column) => total + column._count.tasks,
                0
            )
        }))
        
        res.status(200).json(boardsWithTaskCount)
        
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:err.message
        })
    }
}

export const getSingleBoard = async(req,res) => {
    try{
        const {boardId} = req.params

        const board = await prisma.board.findFirst({
            where: {
                id: Number(boardId),
                workspace: {
                    OR: [
                        { ownerId: req.user.id },
                        { members: { some: { userId: req.user.id } } }
                    ]
                }
            }
        })

        if(!board){
            return res.status(404).json({ message: "Board not found" })
        }

        res.status(200).json(board)
    }catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}


export const deleteBoard = async(req,res) => {
    try{
        const {boardId} = req.params

        await prisma.board.delete({
            where:{
                id: Number(boardId)
            }
        })

        res.status(200).json({
            message:"Board deleted successfully"
        })
    }catch(err){
        console.log(err)

        res.status(500).json({
            message:err.message
        })
    }
}