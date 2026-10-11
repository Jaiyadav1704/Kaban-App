import { useState } from "react";
import api from "../api/axios.js";

function AddMember({workspaceId, onMemberAdded}) {

    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const handleAddMember = async(e) => {
        e.preventDefault()
        setMessage("")

        try{
            const response = await api.post(
                `/workspaces/add-member/${workspaceId}`,
                {email}
            )

            onMemberAdded(response.data)

            setEmail("")
            setMessage("Member added successfully")

        }catch(error){
            setMessage(
                error.response?.data?.message || "Something went wrong"
            )
        }
    }

    return(
        <form onSubmit={handleAddMember} className="flex items-center gap-2">

            <input
                type="email"
                placeholder="User email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-blue-400"
            />

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition"
            >
                Add Member
            </button>

            {message && (
                <p className="text-sm text-gray-600 self-center">
                    {message}
                </p>
            )}

        </form>
    )
}

export default AddMember;