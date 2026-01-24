// frontend/src/App.jsx (update)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Landing from "./pages/user/Landing";
import Lessons from "./pages/user/Lessons";
import Lesson from "./pages/user/Lesson";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ContactsManagement from "./pages/admin/ContactsManagement";
import LessonManagment from "./pages/admin/LessonManagment";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/:slug" element={<Lesson />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/contacts" element={<ContactsManagement />} />
        <Route path="/admin/lessons" element={<LessonManagment />} />
        
        {/* Redirect to login for admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App;