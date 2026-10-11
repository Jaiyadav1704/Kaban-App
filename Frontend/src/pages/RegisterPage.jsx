import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";


function Register() {
    const navigate = useNavigate();
    const {login} = useAuth()
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:""
    })
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    };

    const handleRegister = async(e) => {
        e.preventDefault()
        setError("")

        try{
            const response = await api.post(
                "/auth/register",
                formData
            );

            login(
                response.data.token,
                response.data.user
            )
            navigate("/")
        } catch(err){
            console.log(err)
            setError(err.response?.data?.message || "Something went wrong. Please try again.")
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <form onSubmit={handleRegister} className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8 space-y-5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Start organizing your work
                    </p>
                </div>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-400"/>

                    <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-400"/>

                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-400"/>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition">
                    Register
                </button>

                <p className="text-sm text-center text-gray-500">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        Login
                    </Link>
                </p>

            </form>
        </div>
    )
}

export default Register;