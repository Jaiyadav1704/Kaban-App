import api from "../api/axios.js";
import {useState, useEffect} from "react"

function TaskCard({ task , columns, onTaskDeleted, onTaskUpdated, onTaskMoved}) {

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description || "")
    const [priority, setPriority] = useState(task.priority)
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0,10): "")
    const [assigneeId, setAssigneeId] = useState(task.assigneeId ? String(task.assigneeId) : "")
    const [users, setUsers] = useState([])

    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")
    const [showComments, setShowComments] = useState(false)

    useEffect(() => {
        setTitle(task.title)
        setDescription(task.description || "")
        setPriority(task.priority)
        setDueDate(task.dueDate ? task.dueDate.slice(0,10): "")
        setAssigneeId(task.assigneeId ? String(task.assigneeId) : "")
    },[task])

    useEffect (() => {
        const fetchUsers = async() => {
            try{
                const response = await api.get("/auth/get-users")
                setUsers(response.data)
            }catch(error){
                console.log(error)
            }
        }
        fetchUsers()
    },[])

    useEffect(() => {
        const fetchComments = async() => {
            try{
                const response = await api.get(`/comments/get-comments/${task.id}`)
                setComments(response.data)
            }catch(error){
                console.log(error)
            }
        }

        fetchComments()
    },[task.id])
    
    const handleDeleteTask = async() => {
        try{
            await api.delete(`/tasks/delete-task/${task.id}`)
            onTaskDeleted(task.id)
        }catch(error){
            console.log(error)
        }
    }

    const handleUpdateTask = async() => {
        try{
            const response = await api.put(`/tasks/update-task/${task.id}`, {
                title, 
                description, 
                priority,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                assigneeId: assigneeId ? Number(assigneeId) : null
            })
            onTaskUpdated(response.data)
            setIsEditing(false)
        }catch(error){
            console.log(error)
        }
    }

    const handleAddComment = async(e) => {
        e.preventDefault()

        if(!commentText.trim()){
            return;
        }

        try{
            const response = await api.post(`/comments/create-comment`,{
                taskId: task.id,
                message: commentText
            })
            setComments((prev) => [...prev, response.data])
            setCommentText("")
        }catch(error){
            console.log(error)
        }
    }

    const handleMoveTask = (e) => {
        const newColumnId = e.target.value;

        if(Number(newColumnId) === task.columnId){
            return;
        }

        onTaskMoved(task.id, newColumnId)

    }

    const handleDragStart = (e) => {
        e.dataTransfer.setData("taskId", task.id);
    }

    const priorityStyles = {
        high: "text-red-600 bg-red-50",
        medium: "text-amber-700 bg-amber-50",
        low: "text-green-700 bg-green-50"
    }
    const priorityClass = priorityStyles[String(priority).toLowerCase()] || priorityStyles.medium

    if(isEditing){
        return(
            <form onSubmit={handleUpdateTask}
            className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">

                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:border-blue-400"
                />

                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:border-blue-400"
                />

                <div className="grid grid-cols-2 gap-2">
                    <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:border-blue-400"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>

                    <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:border-blue-400"
                    />
                </div>

                <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:border-blue-400"
                >
                    <option value="">Unassigned</option>

                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                        Save
                    </button>

                    <button type="button" 
                    onClick={() => setIsEditing(false)}
                    className="border border-gray-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>

            </form>
        )
    }

    const assignedUser = users.find(
        (user) => user.id === task.assigneeId
    );

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(/\s+/);
        return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
    }

  return (
    <div  
    draggable="true"
    onDragStart={handleDragStart}
    className="border border-gray-200 rounded-xl p-4 bg-white hover:border-blue-400 hover:shadow-md transition">

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm">
          {task.title}
        </h3>
        <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap ${priorityClass}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mt-1.5 mb-3">
            {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2.5 border-t border-gray-100">
        <span>{task.dueDate ? task.dueDate.slice(0,10) : "No due date"}</span>

        <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-bold flex items-center justify-center flex-none">
                {assignedUser ? getInitials(assignedUser.name) : "?"}
            </div>
            {assignedUser ? assignedUser.name : "Unassigned"}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <div className="flex gap-1">
            <button 
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition"
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>

            <button 
            onClick={handleDeleteTask}
            aria-label="Delete task"
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition"
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
            </button>
        </div>

        <select
        value={task.columnId}
        onChange={handleMoveTask}
        className="border border-gray-300 text-xs px-2 py-1.5 rounded-lg focus:outline-none focus:border-blue-400"
        >
            {columns.map((column) => (
                <option key={column.id} value={column.id}>
                    {column.title}
                </option>
            ))}
        </select>
      </div>

      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="text-xs text-gray-500 hover:text-blue-600 mt-2.5 transition"
      >
        💬 {comments.length === 0 ? "No comments" : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
      </button>

      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="space-y-2 mb-3">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs font-semibold">
                            {comment.user?.name}
                        </p>
                        <p className="text-sm text-gray-600">{comment.message}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAddComment} className="space-y-2">
                <textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:border-blue-400"
                rows={2}
                />

                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition">
                    Add Comment
                </button>
            </form>
        </div>
      )}
    </div>
  );
}

export default TaskCard;