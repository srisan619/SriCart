import Navbar from "../components/Navbar";

function Dashboard(){
    return(
        <div className="d-flex flex-column min-vh-100">
            <Navbar></Navbar>
            <div className="container-main flex-grow-1">
                <h2>Welcome to SriCart Dashboard</h2>
                <p>Here you can manage users, roles, and other administrative tasks.</p>
            </div>
        </div>
    );
}

export default Dashboard;