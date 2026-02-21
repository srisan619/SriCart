import API from "../api/axios";
import Navbar from "../components/Navbar";
import {useEffect, useState} from "react";

function Users(){
    const [users, setUsers] = useState([])

    const fetchUsers = async () => {
        const res = await API.get("/users");
        setUsers(res.data);
    }

    useEffect(()=>{
        fetchUsers();
    }, []);

    return(
        <div>
            <Navbar />
            <h2>Users</h2>
            <ul>
                {users.map(
                    (user) => (
                     <li key={user.id}>{user.username} - {user.email}</li>
                    )
                )}
            </ul>
        </div>
    )
}

export default Users