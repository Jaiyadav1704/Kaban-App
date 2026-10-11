import { useState } from "react";
import api from "../api/axios.js";

function CreateBoard({workspaceId, onBoardCreated}){
    const [title, setTitle] = useState("")

    const handleCreateBorad = async (e) => {
        e.preventDefault()

        try{
            const response = await api.post(
                "/boards/create-board",
                {
                    title,
                    workspaceId:Number(workspaceId)
                }
            )

            onBoardCreated(response.data)
            setTitle("")
        }catch(err){
            console.log(err)
        }
    }

    return(
        <form 
        onSubmit={handleCreateBorad}
        className="flex flex-col gap-4">
            <input
            type="text"
            placeholder="e.g. Sprint Planning"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-400"/>
            <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition">
                Create Board
            </button>

        </form>
    )
}

export default CreateBoard;