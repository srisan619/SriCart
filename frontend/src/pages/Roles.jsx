import API from "../api/axios";
import {useEffect, useState} from "react"
import Navbar from "../components/Navbar"

function Roles(){
    const [roles, setRoles] = useState([])
    const [name, setName] = useState([])

    const fetchRoles = async () => {
        const res = await API.get("/roles");
        setRoles(res.data);
    };

    const createRole = async () => {
        await API.post("/roles", {name});
        setName('');
        fetchRoles();
    };

    useEffect(()=>{
        fetchRoles();
    }, []);


    return (
        <div>
            <Navbar />
            <h2>Roles</h2>
            <input placeholder="New Role" value= {name} onChange={(e) => setName(e.target.value)}/>
            <button onClick={createRole}>Add Role</button>

            <ul>
                {roles.map(
                    (role) => (
                        <li key={role.id}>{role.name}</li>
                    )
                )}
            </ul>
        </div>
    );
}

export default Roles