import API from "../api/axios";
import Navbar from "../components/Navbar";
import {useEffect, useState} from "react";

function Users(){
    const [users, setUsers] = useState([])
    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        active: true
    });
    const [editingId, setEditingId] = useState(null);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const fetchUsers = async () => {
        const token = localStorage.getItem("access_token");
        const res = await API.get("/users", {
            headers: {Authorization: `Bearer ${token}`}
        });
        setUsers(res.data);
    }

    const fetchRoles = async () => {
        const res = await API.get("/roles");
        setRoles(res.data);
    };

    useEffect(()=>{
        fetchUsers();
        fetchRoles();
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
            await API.put(`/users/${editingId}`, {
                username: form.username,
                password: form.password,
                name: form.name,
                email: form.email,
                active: form.active
            }, {
                headers: {Authorization: `Bearer ${token}`}
            });
            
            for (const roleId of selectedRoles){
                await API.post(`/users/${editingId}/assign-role/${roleId}`, {}, {headers: {Authorization: `Bearer ${token}`}});
            }
            setEditingId(null);
        }else{
            await API.post("/register", form, {
                headers: {Authorization: `Bearer ${token}`}
            });
        }
        
        setForm({
            username: "",
            password: "",
            name: "",
            email: "",
            active: true
        })
        fetchUsers();
    }

    
    // New User Button (Reset Everything)
    const handleNewUser = () => {
        setEditingId(null)
        setForm({
            username: "",
            password: "",
            name: "",
            email: "",
            active: true
        });
        setSelectedRoles([]);
    }

    const handleEdit = (user) => {
        setForm({
            username: user.username,
            password: "",
            name: user.name,
            email: user.email,
            active: user.active
        });
        setEditingId(user.id);
        setSelectedRoles(user.roles.map(r=> r.id))
    }

    const handleUnassignRole = async (roleId) => {
        const token = localStorage.getItem("access_token");

        try{
            await API.delete(
                `/users/${editingId}/unassign-role/${roleId}`, {headers: {Authorization: `Bearer ${token}`}}
            );
        
            // Remove from selectedRoles state
            setSelectedRoles(prev => prev.filter(id=> id!==roleId));
            // refresh users list
            fetchUsers();
        }catch (error){
            console.log("Error removing role:", error);
            // alert("Failed to remove role");
        }
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
                {editingId && <select
                    name="active"
                    value={form.active}
                    onChange={(e) =>
                        setForm({ ...form, active: e.target.value === "true" })
                    }
                >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>}
                {editingId && (
                    <>
                        <label htmlFor="roles">Roles</label>
                        <select multiple value={selectedRoles} onChange={(e) => {
                            const selected = Array.from(
                                e.target.selectedOptions,
                                option => parseInt(option.value)
                            );
                            setSelectedRoles(selected);
                        }} >
                        {roles.map(role=> (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                        </select>

                        {/* Assigned Roles List With Remove Button */}
                        <div style={{marginTop: "10px"}}>
                            <strong>Assigned Roles:</strong>
                            {selectedRoles.length === 0 && <p>No roles assigned</p>}
                            {selectedRoles.map(roleId => {
                                const role = roles.find(r=> r.id === roleId);
                                return(
                                    <div key={roleId} style={{marginBottom: "5px"}}>
                                        {role?.name}
                                        <button style={{
                                            marginLeft: "10px",
                                            background: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "2px 6px",
                                            cursor: "pointer"
                                        }} onClick={ () => handleUnassignRole(roleId)}>✕</button>
                                    </div>
                                )
                            })}
                        </div>
                        
                    </>
                )}
                <button onClick={handleSubmit}>
                    {editingId ? "Update User" : "Create User"}
                </button>
            </div>

            <div className="container-main flex-grow-1">
                <h2>User List</h2>
                <button className="btn-new" onClick={handleNewUser}>New User</button>
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
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
                                    <td>{user.roles ? user.roles.map(r=> r.name).join(", ") : ""}</td>
                                    <td>
                                         <span className="status-badge">
                                            {user.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
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