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
        <div>
            <h2>Login</h2>
            <input placeholder="Username" onChange={(e)=> setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login;