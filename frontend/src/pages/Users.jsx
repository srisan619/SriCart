import API from "../api/axios";
import Navbar from "../components/Navbar";
import {useEffect, useState} from "react";

function Users(){
    const [users, setUsers] = useState([])
    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        email: ""
    });
    const [editingId, setEditingId] = useState(null);

    const fetchUsers = async () => {
        const token = localStorage.getItem("access_token");
        const res = await API.get("/users", {
            headers: {Authorization: `Bearer ${token}`}
        });
        setUsers(res.data);
    }

    useEffect(()=>{
        fetchUsers();
    }, []);

    const validateForm = () => {
        if (!form.username || !form.email || !form.name){
            alert("All fields are required");
            return false;
        }
        if (!editingId && !form.password){
            alert("Password is mandatory");
            return false;
        }
        if (!form.email.includes("@")){
            alert("Invalid email address");
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        const token = localStorage.getItem("access_token");
        if (!validateForm()) return;
        if (editingId){
            await API.put(`/users/${editingId}`, form, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setEditingId(null)
        }else{
            await API.post("/register", form, {
                headers: {Authorization: `Bearer ${token}`}
            });
        }
        
        setForm({
            username: "",
            password: "",
            name: "",
            email: ""
        })
        fetchUsers();
    }

    const handleEdit = (user) => {
        setForm({
            username: user.username,
            password: "",
            name: user.name,
            email: user.email
        });
        setEditingId(user.id);
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    return(
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container-main flex-grow-1">
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} disabled={editingId !== null}></input>
                {!editingId && (<input name ="password" placeholder="Password" value = {form.password} onChange={handleChange} />)}
                <input name ="name" placeholder="Name" value = {form.name} onChange={handleChange} />
                <input name ="email" placeholder="Email" value = {form.email} onChange={handleChange} />

                <button onClick={handleSubmit}>
                    {editingId ? "Update User" : "Create User"}
                </button>
            </div>

            <div className="container-main flex-grow-1">
                <h2>User List</h2>
                <button className="btn-new">New</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(
                            (user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role || 'user'}</td>
                                    <td><span className="status-badge">Active</span></td>
                                    <td>
                                        <div className="btn-action">
                                            <button className="btn-icon btn-edit" title="Edit" onClick={()=> handleEdit(user)}><i className="bi bi-pencil-square"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users