import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import Column from "../component/Column.jsx";
import CreateTask from "../component/CreatePage.jsx";

function BoardPage(){
    const {boardId} = useParams()
    const navigate = useNavigate()
    
    const [board, setBoard] = useState(null)
    const [columns, setColumns] = useState([])
    const [tasks, setTasks] = useState([])

    const [search, setSearch] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("All")
    const [showCreate, setShowCreate] = useState(false)

    const fetchBoard = async() => {
        try{
            const response = await api.get(
                `/boards/get-single-board/${boardId}`
            )
            setBoard(response.data)
        }catch(error){
            console.log(error)
        }
    }
    
    const fetchColumns = async() => {
        try{
            const response = await api.get(
                `/columns/get-columns/${boardId}`
            )
            console.log("Columns:", response.data)
            setColumns(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const fetchTasks = async() => {
        try{
            const response = await api.get(
                `/tasks/get-tasks/${boardId}`
            )
            console.log("Tasks:", response.data)
            setTasks(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const moveTask = async(taskId, columnId) => {
        try {
            const response = await api.put(`/tasks/move-task/${taskId}`, 
                {
                    columnId: Number(columnId),
                
                }
            )

            setTasks((prev) => 
                prev.map((task)=>
                    task.id == taskId ? response.data : task
                )
            )

        }catch(error){
            console.log(error)
        }
    }


    useEffect(() => {
        fetchBoard();
        fetchColumns();
        fetchTasks();
    },[])

    const addTask = (newTask) => {
    setTasks((prev) => [...prev,newTask]);
    }

    // Same as addTask, but also closes the create modal once done.
    const handleTaskCreated = (newTask) => {
        addTask(newTask)
        setShowCreate(false)
    }

    const deleteTask = (taskId) => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }

    const updateTask = (updatedTask) => {
        setTasks((prev) => prev.map((task) => task.id === updatedTask.id ? updatedTask : task));
    }

    const filterTasks = tasks.filter((task) => {
        const searchText = search.toLowerCase()

        const matchesSearch = task.title.toLowerCase().includes(searchText) || (task.description || "").toLowerCase().includes(searchText) 
        const matchesPriority = priorityFilter === "All" || String(task.priority).toLowerCase() === priorityFilter.toLowerCase() 
        
        return matchesSearch && matchesPriority
    })

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="px-10 py-8 border-b border-gray-200 bg-white">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-gray-500 hover:text-blue-600 transition mb-2"
                >
                    ‹ Back to boards
                </button>
                <h1 className="text-4xl font-bold tracking-tight">
                    {board?.title ?? "Loading..."}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {tasks.length} tasks across {columns.length} columns
                </p>
            </div>

            <div className="p-10">

                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                    <div className="flex gap-3">
                        <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={search} onChange={(e) => setSearch(e.target.value)} 
                        className="border border-gray-300 p-2 rounded w-64 focus:outline-none focus:border-blue-400" /> 
                        
                        <select 
                        value={priorityFilter} 
                        onChange={(e) => setPriorityFilter(e.target.value)} 
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-400" > 
                            <option value="All">All Priorities</option> 
                            <option value="High">High</option> 
                            <option value="Medium">Medium</option> 
                            <option value="Low">Low</option> 
                        </select> 
                    </div>

                    <button
                        onClick={() => setShowCreate(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
                    >
                        + Add Task
                    </button>
                </div>

                <div className="flex">
                    {columns.map((column, index) => (
                        <div
                            key={column.id}
                            className={`flex-1 px-6 ${index === 0 ? "pl-0" : ""} ${index === columns.length - 1 ? "pr-0" : ""} ${index !== columns.length - 1 ? "border-r border-gray-200" : ""}`}
                        >
                            <Column 
                            column={column}
                            columns={columns}
                            tasks={filterTasks
                                .filter((task) => task.columnId === column.id)
                                    .sort((a, b) => {
                                        const priorityOrder = {
                                            high: 1,
                                            medium: 2,
                                            low: 3
                                        }

                                        const pa = priorityOrder[String(a.priority).toLowerCase()] ?? 2
                                        const pb = priorityOrder[String(b.priority).toLowerCase()] ?? 2

                                        const priorityDifference = pa - pb

                                        if (priorityDifference !== 0) {
                                            return priorityDifference
                                        }

                                        return a.position - b.position
                                    })
                            }
                            onTaskDeleted={deleteTask}
                            onTaskUpdated={updateTask}
                            onTaskMoved={moveTask}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {showCreate && (
                <div
                    onClick={() => setShowCreate(false)}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-7 w-full max-w-md relative shadow-xl"
                    >
                        <button
                            onClick={() => setShowCreate(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-xl leading-none"
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <h3 className="text-lg font-semibold mb-1">New task</h3>
                        <p className="text-sm text-gray-500 mb-5">
                            Fill in the details and assign it to a column.
                        </p>

                        <CreateTask
                            columns={columns}
                            onTaskCreated={handleTaskCreated}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default BoardPage;