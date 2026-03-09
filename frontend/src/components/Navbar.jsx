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
        <nav className="navbar-custom">
            <div className="navbar-container">
                <div className="navbar-brand">Sri Cart</div>
                <ul className="navbar-menu">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }}>Dashboard</a></li>
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle">User Management</a>
                        <ul className="dropdown-menu">
                            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/users"); }}>Users</a></li>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/roles"); }}>Roles</a></li>
                        </ul>
                    </li>
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle">Products</a>
                        <ul className="dropdown-menu">
                            <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/products"); }}>Product List</a></li>
                            
                        </ul>
                    </li>        
                    <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;