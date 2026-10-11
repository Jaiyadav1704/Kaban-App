import { useState } from "react";
import api from "../api/axios.js";

function CreateWorkspace({onWorkspaceCreated}){
    const [name, setName] = useState("");

    const handleCreateWorkspace = async(e) =>{
        e.preventDefault()

        try{
            const response = await api.post(
                "/workspaces/create-workspace",
                {name}
            );

            onWorkspaceCreated(response.data)

            setName("")
        }catch(error){
            console.log(error)
        }
    }

    return(
        <form onSubmit={handleCreateWorkspace}
        className="flex flex-col gap-4">
            <input
            type="text"
            placeholder="Workspace Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"/>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition">
                Create
            </button>
        </form>
    )
}

export default CreateWorkspace;