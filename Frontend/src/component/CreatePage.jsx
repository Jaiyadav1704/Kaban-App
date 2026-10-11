import {useState, useEffect} from "react";
import api from "../api/axios.js";

function CreateTask({columns, defaultColumnId, onTaskCreated}){
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("Medium")
    const [dueDate, setDueDate] = useState("")
    const [assigneeId, setAssigneeId] = useState("")
    const [columnId, setColumnId] = useState(defaultColumnId ?? columns?.[0]?.id ?? "")
    const [users, setUsers] = useState([])

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

    const handleCreateTask = async(e) => {
        e.preventDefault()

        try{
            const response = await api.post("/tasks/create-task", {
                title,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                columnId: Number(columnId),
                assigneeId: assigneeId ? Number(assigneeId) : null
                
            })

            onTaskCreated(response.data);

            setTitle("")
            setDescription("")
            setPriority("Medium")
            setDueDate("")
            setAssigneeId("")
        }catch(error){
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">Title</label>
                <input
                type="text"
                placeholder="e.g. Fix login redirect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">Description</label>
                <textarea 
                placeholder="Optional details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
                rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Column</label>
                    <select 
                    value={columnId}
                    onChange={(e) => setColumnId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
                    >
                        {columns?.map((column) => (
                            <option key={column.id} value={column.id}>
                                {column.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Priority</label>
                    <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
                    >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Due date</label>
                    <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Assignee</label>
                    <select 
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"
                    >
                        <option value="">Unassigned</option>

                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition">
                Create Task
            </button>
        </form>
    )
}

export default CreateTask;

// import {useState, useEffect} from "react";
// import api from "../api/axios.js";

// function CreateTask({columnId, onTaskCreated}){
//     const [title, setTitle] = useState("")
//     const [description, setDescription] = useState("")
//     const [priority, setPriority] = useState("Medium")
//     const [dueDate, setDueDate] = useState("")
//     const [assigneeId, setAssigneeId] = useState("")
//     const [users, setUsers] = useState([])

//     useEffect (() => {
//         const fetchUsers = async() => {
//             try{
//                 const response = await api.get("/auth/get-users")
//                 setUsers(response.data)
//             }catch(error){
//                 console.log(error)
//             }
//         }
        
//         fetchUsers()
//     },[])

//     const handleCreateTask = async(e) => {
//         e.preventDefault()

//         try{
//             const response = await api.post("/tasks/create-task", {
//                 title,
//                 description,
//                 priority,
//                 dueDate: dueDate ? new Date(dueDate).toISOString() : null,
//                 columnId: Number(columnId),
//                 assigneeId: assigneeId ? Number(assigneeId) : null
                
//             })

//             onTaskCreated(response.data);

//             setTitle("")
//             setDescription("")
//             setPriority("Medium")
//             setDueDate("")
//             setAssigneeId("")
//         }catch(error){
//             console.log(error)
//         }
//     }

//     return (
//         <form onSubmit = {handleCreateTask} className="space-y-2 mb-4">
//             <input
//             type = "text"
//             placeholder = "Task Title"
//             value = {title}
//             onChange = {(e) => setTitle(e.target.value)}
//             className = "border p-2 rounded w-full"
//             />

//             <textarea 
//             placeholder = "Task Description"
//             value = {description}
//             onChange = {(e) => setDescription(e.target.value)}
//             className = "border p-2 rounded w-full"
//             />

//             <select 
//             value = {priority}
//             onChange = {(e) => setPriority(e.target.value)}
//             className = "border p-2 rounded w-full"
//             >
//                 <option value = "High">High</option>
//                 <option value = "Medium">Medium</option>
//                 <option value = "Low">Low</option>
//             </select>

//             <input 
//             type = "date"
//             value = {dueDate}
//             onChange = {(e) => setDueDate(e.target.value)}
//             className = "border p-2 rounded w-full"
//             />

//             <select 
//             value = {assigneeId}
//             onChange = {(e) => setAssigneeId(e.target.value)}
//             className = "border p-2 rounded w-full"
//             >
//                 <option value = "">Unassgined</option>

//                 {users.map((user) => (
//                     <option key={user.id} value={user.id}>
//                         {user.name}
//                     </option>
//                 ))}
//             </select>

//             <button type = "submit" className = "border px-3 py-2 rounded ">
//                 Add Task
//             </button>
//         </form>
//     )
// }

// export default CreateTask;