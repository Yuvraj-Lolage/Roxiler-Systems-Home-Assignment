import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/signup/signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import AdminDashboard from './components/dashboard/admin_dashboard';
import StoreDashboard from './components/dashboard/store_dashboard';
import RenderLayout from './components/render_layout/render_layout';
import Navbar from './components/navbar/navbar';
import Users from './components/admin/users';
import Stores from './components/admin/stores';
import ChangePassword from './components/change_password/change_password';
import AddUser from './components/admin/add_user';
import AddStore from './components/admin/add_store';


function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<RenderLayout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Normal User routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/stores" element={<Dashboard />} />

        {/* admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/users" element={<Users />} />
        <Route path="/admin/dashboard/stores" element={<Stores />} />
        <Route path="/admin/dashboard/add-user" element={<AddUser />} />
        <Route path="/admin/dashboard/add-store" element={<AddStore />} />

        {/* store owner routes */}
        <Route path="/store/dashboard" element={<StoreDashboard />} />
      </Routes>
    </BrowserRouter>
    // <h1>
    //   Working
    // </h1>
  );
}

export default App;
