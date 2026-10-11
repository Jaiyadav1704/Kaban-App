import {BrowserRouter, Routes,Route} from "react-router-dom";
import Login from "../pages/LoginPage.jsx"
import Register from "../pages/RegisterPage.jsx"
import Dashboard from "../pages/DashboardPage.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx";
import WorkspacePage from "../pages/WorkspacePage.jsx";
import BoardPage from "../pages/BoardPage.jsx";

function AppRoutes() {
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element = {<Register/>}/>
            <Route path="/workspace/:workspaceId" element= {<WorkspacePage/>}/>
            <Route path="/boards/:boardId" element={<BoardPage/>}/>
        </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;