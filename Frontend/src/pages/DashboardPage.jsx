import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios.js";
import CreateWorkspace from "../component/CreateWorkspace.jsx";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

function DashboardPage() {
  const [workspaces, setWorkspaces] = useState([])
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const {user, logout} = useAuth();

  const navigate = useNavigate()

  const fetchWorkspace = async() => {
    try{
      const response = await api.get(
        "/workspaces/get-workspace"
      )

      console.log(response.data)
      setWorkspaces(response.data)
    }catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    fetchWorkspace()
  },[])

  const handlelogout = () => {
    logout();
    navigate("/login")
  }

  const handleDeleteWorkspace = async(e, workspaceId) => {
        e.stopPropagation()
        setDeleteError("")

        const confirmed = window.confirm(
            "Are you sure you want to delete this workspace? All boards and tasks inside it will also be deleted."
        )

        if(!confirmed){
            return
        }

        try{
            await api.delete(`/workspaces/delete-workspace/${workspaceId}`)

            setWorkspaces((prev) =>
                prev.filter((workspace) => workspace.id !== workspaceId)
            )
        }catch(error){
            console.log(error)
            setDeleteError(
                error.response?.data?.message || "Couldn't delete this workspace. Please try again."
            )
        }
    }

  const addworkspace = (newWorkspace) => {
    setWorkspaces((prev) => [...prev,newWorkspace])
  }

  // Same as addworkspace, but also closes the create modal once done.
  const handleWorkspaceCreated = (newWorkspace) => {
    addworkspace(newWorkspace)
    setShowCreate(false)
  }

  const filteredWorkspaces = workspaces.filter((workspace) => 
    workspace.name.toLowerCase().includes(search.toLowerCase()) )

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex justify-between items-center px-10 py-8 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg flex-none">
            {getInitials(user?.name)}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome {user?.name}
          </h1>
        </div>

        <button
          onClick={handlelogout}
          className="border px-4 py-2 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition hover:shadow-xl">
          Logout
        </button>
      </div>

      <div className="p-10">

        <div className="mt-0">
          <input 
            type="text" 
            placeholder="Search workspaces..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="border p-2 rounded w-64 focus:outline-none focus:border-blue-400 " /> 
        </div>

        {deleteError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-4 inline-block">
            {deleteError}
          </p>
        )}

        <div className="mt-8">
          {search && filteredWorkspaces.length === 0 && (
            <p className="text-gray-500 mb-4">
              No workspaces found.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredWorkspaces.map((workspace) => {
              const isOwner = workspace.ownerId === user?.id
              const visibleMembers = (workspace.members ?? []).slice(0, 3)
              const overflowCount = (workspace.members?.length ?? 0) - visibleMembers.length

              return (
                <div
                  key={workspace.id}
                  onClick={() => navigate(`/workspace/${workspace.id}`)}
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
                  {isOwner && (
                    <button
                      onClick={(e) => handleDeleteWorkspace(e, workspace.id)}
                      aria-label="Delete workspace"
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
                  )}

                  <div>
                    <h2 className="text-xl font-semibold pr-8">
                      {workspace.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                      Workspace
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-gray-300">
                    <p className="text-sm text-gray-600">
                      {workspace._count?.boards ?? 0} Boards
                    </p>

                    <div className="flex">
                      {visibleMembers.map((member) => (
                        <div
                          key={member.id ?? member.user?.id}
                          title={member.user?.name || member.user?.email}
                          className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold flex items-center justify-center border-2 border-white ring-1 ring-gray-200 -ml-2 first:ml-0"
                        >
                          {getInitials(member.user?.name)}
                        </div>
                      ))}
                      {overflowCount > 0 && (
                        <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center border-2 border-white ring-1 ring-gray-200 -ml-2">
                          +{overflowCount}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )
            })}

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
              <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-lg group-hover:border-gray-900">
                +
              </div>
              <span className="text-sm font-medium">New workspace</span>
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

            <h3 className="text-lg font-semibold mb-1">New workspace</h3>
            <p className="text-sm text-gray-500 mb-5">
              Give your workspace a name to get started.
            </p>

            <CreateWorkspace onWorkspaceCreated={handleWorkspaceCreated}/>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;