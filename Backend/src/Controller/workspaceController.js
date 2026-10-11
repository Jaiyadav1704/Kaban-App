import prisma from "../Prisma/client.js"

// Returns the workspace if the user is the owner OR a member, else null.
const getWorkspaceIfMember = async (workspaceId, userId) => {
    return prisma.workspace.findFirst({
        where: {
            id: Number(workspaceId),
            OR: [
                { ownerId: userId },
                { members: { some: { userId } } }
            ]
        }
    })
}

// Returns the workspace only if the user is the owner, else null.
const getWorkspaceIfOwner = async (workspaceId, userId) => {
    return prisma.workspace.findFirst({
        where: {
            id: Number(workspaceId),
            ownerId: userId
        }
    })
}

export const createWorkspace = async(req,res) => {
    try{
        const {name} = req.body

        const workspace = await prisma.workspace.create({
            data: {
                name,
                ownerId: req.user.id,
                members: {
                    create: {
                        userId: req.user.id,
                        role: "owner"
                    }
                }
            },
            include: {
                _count: { select: { boards: true } },
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                }
            }
        })

        res.status(201).json(workspace)

    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


export const getUserWorkspace = async(req,res) => {
    try{
        const workspaces = await prisma.workspace.findMany({
            where: {
                OR: [
                    { ownerId: req.user.id },
                    { members: { some: { userId: req.user.id } } }
                ]
            },
            include: {
                _count: { select: { boards: true } },
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                }
            }
        })

        res.status(200).json(workspaces)

    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


export const getSingleWorkspace = async(req,res) => {
    try{
        const {workspaceId} = req.params

        const workspace = await getWorkspaceIfMember(workspaceId, req.user.id)

        if(!workspace){
            return res.status(404).json({ message: "Workspace not found" })
        }

        res.status(200).json(workspace)

    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


export const addWorkspaceMember = async(req,res) => {
    try{
        const {workspaceId} = req.params
        const {email} = req.body

        const workspace = await getWorkspaceIfOwner(workspaceId, req.user.id)

        if(!workspace){
            return res.status(403).json({ message: "Only the workspace owner can add members" })
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: Number(workspaceId)
                }
            }
        })

        if(existingMember){
            return res.status(400).json({ message: "User is already a member" })
        }

        const member = await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId: Number(workspaceId),
                role: "member"
            },
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        })

        res.status(201).json(member)

    }catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}


export const getWorkspaceMembers = async(req,res) => {
    try{
        const {workspaceId} = req.params

        const workspace = await getWorkspaceIfMember(workspaceId, req.user.id)

        if(!workspace){
            return res.status(404).json({ message: "Workspace not found" })
        }

        const members = await prisma.workspaceMember.findMany({
            where: { workspaceId: Number(workspaceId) },
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        })

        res.status(200).json(members)

    }catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

export const removeWorkspaceMember = async(req,res) => {
    try{
        const {workspaceId, userId} = req.params

        const workspace = await getWorkspaceIfOwner(workspaceId, req.user.id)

        if(!workspace){
            return res.status(403).json({ message: "Only the workspace owner can remove members" })
        }

        if(Number(userId) === req.user.id){
            return res.status(400).json({ message: "Owner cannot remove themselves" })
        }

        await prisma.workspaceMember.delete({
            where: {
                userId_workspaceId: {
                    userId: Number(userId),
                    workspaceId: Number(workspaceId)
                }
            }
        })

        res.status(200).json({ message: "Member removed successfully" })

    }catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}


export const deleteWorkspace = async(req,res) => {
    try{
        const {workspaceId} = req.params

        const workspace = await getWorkspaceIfOwner(workspaceId, req.user.id)

        if(!workspace){
            return res.status(404).json({ message: "Workspace not found" })
        }

        await prisma.workspace.delete({ where: { id: Number(workspaceId) } })

        res.status(200).json({ message: "Workspace deleted successfully" })

    }catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}