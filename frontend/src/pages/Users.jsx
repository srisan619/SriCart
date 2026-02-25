// --- IMPORTS ---
import API from "../api/axios"; // Importing the custom axios instance for API calls
import Navbar from "../components/Navbar"; // Importing the navigation bar component
import { useEffect, useState } from "react"; // Importing React hooks for state and lifecycle

function Users() {
    // --- STATE MANAGEMENT (Local Memory) ---
    const [users, setUsers] = useState([]); // Stores the list of users retrieved from the database
    const [form, setForm] = useState({      // Stores the data currently typed into the input fields
        username: "",
        password: "",
        name: "",
        email: "",
        active: true
    });
    const [editingId, setEditingId] = useState(null); // Keeps track of which user is being edited (null = creating new)
    const [roles, setRoles] = useState([]);           // Stores all available roles (e.g., Admin, User) from the database
    const [selectedRoles, setSelectedRoles] = useState([]); // Stores the IDs of roles selected for the current user
    const initialFormState = {
        username: "",
        password: "",
        name: "",
        email: "",
        active: true
    };

    // --- DATA FETCHING FUNCTIONS ---

    // Function to get the list of users from the backend
    const fetchUsers = async () => {
        const token = localStorage.getItem("access_token"); // Retrieve the security token from browser storage
        const res = await API.get("/users", {
            headers: { Authorization: `Bearer ${token}` } // Send token in the header for authentication
        });
        setUsers(res.data); // Update the users state with the data received from the server
    }

    // Function to get all possible roles from the backend
    const fetchRoles = async () => {
        const res = await API.get("/roles"); // Public endpoint to get role options
        setRoles(res.data); // Update the roles state
    };

    // useEffect hook: Runs code automatically when the component first appears on screen
    useEffect(() => {
        fetchUsers(); // Load users immediately
        fetchRoles(); // Load roles immediately
    }, []); // Empty array means "only run once on load"

    // --- FORM LOGIC ---

    // Validates that the user entered correct data before sending to the server
    const validateForm = () => {
        if (!form.username || !form.email || !form.name) {
            alert("All fields are required"); // Basic check for empty fields
            return false;
        }
        if (!editingId && !form.password) {
            alert("Password is mandatory"); // Password is only required when creating a new user
            return false;
        }
        if (!form.email.includes("@")) {
            alert("Invalid email address"); // Simple check for an @ symbol in email
            return false;
        }
        return true; // Everything is correct
    }

    // Handles the "Save" or "Update" button click
    const handleSubmit = async () => {
        const token = localStorage.getItem("access_token"); // Get token for security
        if (!validateForm()) return; // Stop if the form validation fails

        if (editingId) {
            // IF EDITING: Send a PUT request to update existing user data
            await API.put(`/users/${editingId}`, {
                username: form.username,
                password: form.password,
                name: form.name,
                email: form.email,
                active: form.active
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Assign roles one by one after updating user info
            const currentUser = users.find(u=>u.id === editingId);
            const existingRoleIds = currentUser?.roles?.map(r=>r.id) || [];
            for (const roleId of selectedRoles) {
                if (!existingRoleIds.includes(roleId)){
                    await API.post(`/users/${editingId}/assign-role/${roleId}`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }                
            }
            setEditingId(null); // Switch back to "Create Mode"
        } else {
            // IF CREATING: Send a POST request to register a new user
            await API.post("/register", form, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        
        // Clear the form fields after submission
        setForm(initialFormState);
        fetchUsers(); // Refresh the user list to show changes
    }

    // Function to clear the form when the "New User" button is clicked
    const handleNewUser = () => {
        setEditingId(null) // Ensure we are in "Create Mode"
        setForm(initialFormState);
        setSelectedRoles([]); // Reset role selections
    }

    // Function to populate the form with a specific user's data for editing
    const handleEdit = (user) => {
        setForm({
            username: user.username,
            password: "", // Don't show the password for security
            name: user.name,
            email: user.email,
            active: user.active
        });
        setEditingId(user.id); // Save the ID so the system knows which user to update later
        setSelectedRoles(user.roles.map(r => r.id)) // Convert role objects into a simple list of IDs
    }

    // Function to remove a role from a user via the API
    const handleUnassignRole = async (roleId) => {
        const token = localStorage.getItem("access_token");
        try {
            await API.delete(`/users/${editingId}/unassign-role/${roleId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
            // Update the UI immediately by filtering out the removed role ID
            setSelectedRoles(prev => prev.filter(id => id !== roleId));
            fetchUsers(); // Refresh the main table data
        } catch (error) {
            console.log("Error removing role:", error);
        }
    }

    // Updates the form state whenever a user types in any input field
    const handleChange = (e) => {
        setForm({
            ...form, // Keep existing values
            [e.target.name]: e.target.value, // Update only the field that changed (matching the 'name' attribute)
        });
    }

    // --- RENDER (The HTML part) ---
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container-main flex-grow-1">
                {/* Input Fields */}
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} disabled={editingId !== null} />
                {!editingId && (<input name="password" placeholder="Password" value={form.password} onChange={handleChange} />)}
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                
                {/* Status Dropdown: Only visible when editing */}
                {editingId && (
                    <select name="active" value={form.active} onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                )}

                {/* Role Multi-Select: Only visible when editing */}
                {editingId && (
                    <>
                        <label htmlFor="roles">Roles</label>
                        <select multiple value={selectedRoles} onChange={(e) => {
                            // Converts multiple selected options into an array of integers (IDs)
                            const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                            setSelectedRoles(selected);
                        }}>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>

                        {/* List of current roles with a delete button (X) */}
                        <div style={{ marginTop: "10px" }}>
                            <strong>Assigned Roles:</strong>
                            {selectedRoles.length === 0 && <p>No roles assigned</p>}
                            {selectedRoles.map(roleId => {
                                const role = roles.find(r => r.id === roleId); // Find the role name from the ID
                                return (
                                    <div key={roleId} style={{ marginBottom: "5px" }}>
                                        {role?.name} 
                                        <button style={{ marginLeft: "10px", background: "red", color: "white", border: "none", cursor: "pointer" }} 
                                                onClick={() => handleUnassignRole(roleId)}>✕</button>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* Submit Button: Text changes based on mode */}
                <button onClick={handleSubmit}>
                    {editingId ? "Update User" : "Create User"}
                </button>
            </div>

            {/* THE USER LIST TABLE */}
            <div className="container-main flex-grow-1">
                <h2>User List</h2>
                <button className="btn-new" onClick={handleNewUser}>New User</button>
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                {/* Join multiple role names into a single string separated by commas */}
                                <td>{user.roles ? user.roles.map(r => r.name).join(", ") : ""}</td>
                                <td>
                                    <span className="status-badge">{user.active ? "Active" : "Inactive"}</span>
                                </td>
                                <td>
                                    {/* Action Buttons */}
                                    <div className="btn-action">
                                        <button className="btn-icon btn-edit" title="Edit" onClick={() => handleEdit(user)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users;