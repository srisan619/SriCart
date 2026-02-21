import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Roles from './pages/Roles'
import Users from './pages/Users'

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/users" element={<Users/>} />
        <Route path='/roles' element={<Roles/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
