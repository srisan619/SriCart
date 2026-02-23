import API from "../api/axios";
import {useEffect, useState} from "react"
import Navbar from "../components/Navbar"

function Roles(){
    const [roles, setRoles] = useState([])
    // const [selectedRoles, setSelectedRoles] = useState([]);
    const [name, setName] = useState("")
    const [editingId, setEditingId] = useState(null)

    const fetchRoles = async () => {
        const token = localStorage.getItem("access_token");
        const res = await API.get("/roles", {
            headers: {Authorization: `Bearer ${token}`}
        });
        setRoles(res.data);
    };

    const handleSubmit = async () => {
        if (!name.trim()){
            alert("Role name is required");
            return;
        }
        const token = localStorage.getItem("access_token");
        if (editingId){
            await API.put(`/roles/${editingId}`, {name}, {
                headers: {Authorization: `Bearer ${token}`}
            });
            setEditingId(null);
        }else{
            await API.post("/roles", {name}, {
                headers: {Authorization: `Bearer ${token}`}
            });
        }

        setName('');
        fetchRoles();
    };

    const handleEdit = (role) => {
        setName(role.name);
        setEditingId(role.id)
    }

    const handleDelete = async (id) => {
        if (window.confirm("Delete this role?")){
            await API.delete(`/roles/${id}`);
            fetchRoles();
        }
    }

    useEffect(()=>{
        fetchRoles();
    }, []);


    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container-main flex-grow-1">
                <h2>Roles</h2>
                <div className="input-group">
                    <input 
                        type="text"
                        placeholder="Role name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                    />
                    <button onClick={handleSubmit} className="btn-new">
                        {editingId ? "Update Role" : "Create Role"}
                    </button>
                </div><br/><br/>

                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Role Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(
                            (role) => (
                                <tr key={role.id}>
                                    <td>{role.name}</td>
                                    <td>
                                        <div className="btn-action">
                                            <button className="btn-icon btn-edit" title="Edit" onClick={() => handleEdit(role)}><i className="bi bi-pencil-square"></i></button>
                                            <button className="btn-icon btn-view" title="View" onClick={()=> handleDelete(role.id)}><i className="bi bi-trash3"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Roles