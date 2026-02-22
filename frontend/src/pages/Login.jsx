import {useState} from "react"
import API from "../api/axios";
import {useNavigate} from "react-router-dom"

function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        // try{
            const response = await API.post("/login", {
                username, password
            });
            localStorage.setItem("access_token", response.data.access_token);
            navigate("/dashboard");
        // }catch(error){
        //     alert("Invalid credentials");
        // }
    };

    return(
        <div className="d-flex align-items-center justify-content-center" style={{minHeight: '72vh'}}>
            <div style={{width: 360}}>
                <div className="card shadow p-4">
                    <h3 className="text-center mb-3">Login</h3>
                    <div className="mb-2">
                        <input placeholder="Username" onChange={(e)=> setUsername(e.target.value)} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="form-control"/>
                    </div>
                    <button onClick={handleLogin} className="btn btn-primary w-100">Login</button>
                </div>
            </div>
        </div>
    )
}

export default Login;