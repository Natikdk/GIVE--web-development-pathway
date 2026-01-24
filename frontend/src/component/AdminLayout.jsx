
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAdminProfile, adminLogout } from '../api/admin';
import '../styles/component/AdminLayout.css';



function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getAdminProfile();
      setAdmin(response.admin);
    } catch (error) {
      // Redirect to login if not authenticated
      if (location.pathname !== '/admin/login') {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="loading-fullscreen">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!admin && location.pathname !== '/admin/login') {
    return null;
  }

  const isLoginPage = location.pathname === '/admin/login';

  if (isLoginPage) {
    return children;
  }

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>GIVE</h2>
          <p className="admin-role">Admin Panel</p>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <a href="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
                 Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/lessons" className={location.pathname.startsWith('/admin/lessons') ? 'active' : ''}>
                Lessons
              </a>
            </li>
            <li>
              <a href="/admin/contacts" className={location.pathname === '/admin/contacts' ? 'active' : ''}>
                Messages
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="admin-info">
            <p><strong>{admin?.username}</strong></p>
            <p className="text-muted">{admin?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </aside>
      
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;