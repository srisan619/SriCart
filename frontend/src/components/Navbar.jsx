import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Navbar(){
    const navigate = useNavigate();

    const handleLogout = async () => {
        try{
            await API.post("/logout");
        }catch(error){
            alert("Pleas contact administrator")
        }

        localStorage.removeItem("access_token");
        navigate("/");
    }

    return(
        <div>
            <button onClick={()=> navigate("/users")}>Users</button>
            <button onClick={()=> navigate("/roles")}>Roles</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Navbar;