import {useNavigate, useParams} from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios.js";
import CreateBoard from "../component/CreateBoard.jsx";
import AddMember from "../component/AddMember.jsx";

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
    return initials.join("") || "?";
}

function WorkspacePage() {
    const {workspaceId} = useParams()
    const navigate = useNavigate()
    const {user} = useAuth()

    const [workspace, setWorkspace] = useState(null)
    const [boards, setBoard] = useState([])
    const [members, setMembers] = useState([])
    const [search, setSearch] = useState("")
    const [showCreate, setShowCreate] = useState(false)
    const [showManage, setShowManage] = useState(false)

    const fetchBoards = async() => {
        try{
            const response = await api.get(
                `/boards/get-board/${workspaceId}`
            )
            setBoard(response.data)
        
        }catch(error){
            console.log(error)
            
        }
    }
    const fetchWorkspace = async() => {
        try{
            const response = await api.get(
                `/workspaces/get-workspace/${workspaceId}`
            )

            setWorkspace(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const fetchMembers = async() => {
        try{
            const response = await api.get(
                `/workspaces/get-members/${workspaceId}`
            )

            setMembers(response.data)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => { 
        fetchBoards()
        fetchWorkspace()
        fetchMembers()
    },[])

    const addBoards = (newBoard) => {
        setBoard((prev) => [...prev,newBoard])
    }

    // Same as addBoards, but also closes the create modal once done.
    const handleBoardCreated = (newBoard) => {
        addBoards(newBoard)
        setShowCreate(false)
    }

    const handleMemberAdded = (newMember) => {
        setMembers((prev) => [...prev, newMember])
    }

    const handleRemoveMember = async(memberUserId) => {
        const confirmed = window.confirm("Remove this member from the workspace?")

        if(!confirmed){
            return
        }

        try{
            await api.delete(`/workspaces/remove-member/${workspaceId}/${memberUserId}`)

            setMembers((prev) =>
                prev.filter((member) => member.user.id !== memberUserId)
            )
        }catch(error){
            console.log(error)
        }
    }

    const handleDeleteBoard = async(e, boardId) => {
        e.stopPropagation()

        const confirmed = window.confirm(
            "Are you sure you want to delete this board? All tasks inside it will also be deleted."
        )

        if(!confirmed){
            return
        }

        try{
            await api.delete(`/boards/delete-board/${boardId}`)

            setBoard((prev) =>
                prev.filter((board) => board.id !== boardId)
            )
        }catch(error){
            console.log(error)
        }
    }

    const filteredBoards = boards.filter((board) => 
        board.title.toLowerCase().includes(search.toLowerCase()) )

    const isOwner = workspace?.ownerId === user?.id

    const visibleMembers = members.slice(0, 4)
    const overflowCount = members.length - visibleMembers.length

    return(
        <div className="min-h-screen bg-slate-50">

            <div className="flex justify-between items-start px-10 py-8 border-b border-gray-200 bg-white">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-500 hover:text-blue-600 transition mb-2"
                    >
                        ‹ Back to workspaces
                    </button>
                    <h1 className="text-4xl font-bold tracking-tight">
                        {workspace?.name}
                    </h1>
                    <div className="mt-4">
                        <AddMember
                            workspaceId={workspaceId}
                            onMemberAdded={handleMemberAdded}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {boards.length} boards
                    </p>
                </div>

                {members.length > 0 && (
                    <div className="flex items-center gap-3 flex-none">
                        <div className="flex">
                            {visibleMembers.map((member) => (
                                <div
                                    key={member.id ?? member.user?.id}
                                    title={member.user?.name || member.user?.email}
                                    className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold flex items-center justify-center border-2 border-white ring-1 ring-gray-200 -ml-2 first:ml-0"
                                >
                                    {getInitials(member.user?.name)}
                                </div>
                            ))}
                            {overflowCount > 0 && (
                                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center border-2 border-white ring-1 ring-gray-200 -ml-2">
                                    +{overflowCount}
                                </div>
                            )}
                        </div>
                        <div className="text-sm text-gray-500 leading-tight">
                            <div>{members.length} {members.length === 1 ? "member" : "members"}</div>
                            {isOwner && (
                                <button
                                    onClick={() => setShowManage(true)}
                                    className="text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Manage
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-10">

                <div className="mt-0">
                    <input 
                        type="text" 
                        placeholder="Search boards..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        className="border p-2 rounded w-64 focus:outline-none focus:border-blue-400" /> 
                </div>

                <div className="mt-8">
                    {search && filteredBoards.length === 0 && (
                        <p className="text-gray-500 mb-4">
                            No boards found.
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {filteredBoards.map((board) => (
                            <div
                                key={board.id}
                                onClick={() => navigate(`/boards/${board.id}`)}
                                className="
                                    group
                                    relative
                                    border
                                    border-l-4
                                    border-l-blue-600
                                    rounded-xl
                                    p-6
                                    min-h-44
                                    flex
                                    flex-col
                                    justify-between
                                    cursor-pointer
                                    transition-all
                                    duration-500
                                    ease-in-out
                                    hover:bg-blue-50
                                    hover:border-blue-400
                                    hover:border-l-blue-600
                                    hover:shadow-xl/20
                                    hover:-translate-y-1
                                "
                            >
                                <button
                                    onClick={(e) => handleDeleteBoard(e, board.id)}
                                    aria-label="Delete board"
                                    className="
                                        absolute
                                        top-3
                                        right-3
                                        w-8
                                        h-8
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        text-gray-300
                                        opacity-0
                                        group-hover:opacity-100
                                        hover:bg-red-50
                                        hover:text-red-600
                                        transition
                                    "
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                        <path d="M10 11v6"/>
                                        <path d="M14 11v6"/>
                                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                    </svg>
                                </button>

                                <div>
                                    <h2 className="text-xl font-semibold pr-8">
                                        {board.title}
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-2">
                                        Board
                                    </p>
                                </div>

                                <p className="text-sm text-gray-600 pt-3 border-t-2 border-gray-300">
                                    {board.taskCount ?? 0} Tasks
                                </p>

                            </div>
                        ))}

                        <div
                            onClick={() => setShowCreate(true)}
                            className="
                                border
                                border-dashed
                                border-gray-200
                                rounded-xl
                                p-6
                                min-h-44
                                flex
                                flex-col
                                items-center
                                justify-center
                                gap-2
                                cursor-pointer
                                text-gray-400
                                transition-all
                                duration-300
                                hover:border-gray-900
                                hover:text-gray-900
                            "
                        >
                            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-lg">
                                +
                            </div>
                            <span className="text-sm font-medium">New board</span>
                        </div>

                    </div>
                </div>

            </div>

            {showCreate && (
                <div
                    onClick={() => setShowCreate(false)}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-7 w-full max-w-sm relative shadow-xl"
                    >
                        <button
                            onClick={() => setShowCreate(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-xl leading-none"
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <h3 className="text-lg font-semibold mb-1">New board</h3>
                        <p className="text-sm text-gray-500 mb-5">
                            Give your board a name to get started.
                        </p>

                        <CreateBoard workspaceId={workspaceId} onBoardCreated={handleBoardCreated}/>
                    </div>
                </div>
            )}

            {showManage && (
                <div
                    onClick={() => setShowManage(false)}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-7 w-full max-w-sm relative shadow-xl"
                    >
                        <button
                            onClick={() => setShowManage(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-xl leading-none"
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <h3 className="text-lg font-semibold mb-1">Manage members</h3>
                        <p className="text-sm text-gray-500 mb-5">
                            Remove people who no longer need access.
                        </p>

                        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
                            {members.map((member) => (
                                <div
                                    key={member.id ?? member.user?.id}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold flex items-center justify-center flex-none">
                                            {getInitials(member.user?.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {member.user?.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {member.user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    {member.role === "owner" ? (
                                        <span className="text-xs text-gray-400 flex-none">Owner</span>
                                    ) : (
                                        <button
                                            onClick={() => handleRemoveMember(member.user.id)}
                                            className="text-xs text-red-500 hover:text-red-700 hover:underline flex-none"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default WorkspacePage;