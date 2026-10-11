
import prisma from "../Prisma/client.js";

const normalizePriority = (p) => {
    const map = { high: "High", medium: "Medium", low: "Low" };
    return map[String(p).toLowerCase()] || "Medium";
};

export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            columnId,
            assigneeId
        } = req.body;

        const targetColumnId = Number(columnId);

        // Auto-compute position: append to the end of the target column
        const lastTask = await prisma.task.findFirst({
            where: { columnId: targetColumnId },
            orderBy: { position: "desc" }
        });

        const newPosition = lastTask ? lastTask.position + 1 : 1;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: normalizePriority(priority),
                dueDate,
                position: newPosition,
                columnId: targetColumnId,
                assigneeId
            }
        });

        res.status(201).json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export const getTask = async (req, res) => {
    try {
        const { columnId } = req.params;

        const tasks = await prisma.task.findMany({
            where: {
                column: { boardId: Number(columnId) }
            },
            include: {
                assignee: true,
                comments: true
            },
            orderBy: { position: "asc" }
        });

        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, priority, dueDate, assigneeId } = req.body;

        const updatedTask = await prisma.task.update({
            where: { id: Number(taskId) },
            data: {
                title,
                description,
                priority: priority ? normalizePriority(priority) : undefined,
                dueDate,
                assigneeId
            }
        });

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        await prisma.task.delete({ where: { id: Number(taskId) } });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const moveTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { columnId } = req.body;
        const newColumnId = Number(columnId);

        // Auto-compute position: append to the end of the target column
        const lastTask = await prisma.task.findFirst({
            where: { columnId: newColumnId },
            orderBy: { position: "desc" }
        });

        const newPosition = lastTask ? lastTask.position + 1 : 1;

        const movedTask = await prisma.task.update({
            where: { id: Number(taskId) },
            data: {
                columnId: newColumnId,
                position: newPosition
            }
        });

        res.status(200).json(movedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};