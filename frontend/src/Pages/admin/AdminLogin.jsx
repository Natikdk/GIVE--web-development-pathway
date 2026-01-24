import { useState } from 'react';
import { adminLogin } from '../../api/admin';
import '../../styles/admin/AdminLogin.css';

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await adminLogin(formData.email, formData.password);
      // Redirect to dashboard on success
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <h1>Learning Center Admin</h1>
          <p>Sign in to your admin account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@learningcenter.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
            {/* Optional: Add password strength indicator */}
            <div className="password-strength strength-strong">
              <span>Password strength:</span>
              <div className="strength-bar">
                <div className="strength-fill"></div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>

          <div className="forgot-password">
            <a href="/admin/forgot-password">Forgot your password?</a>
          </div>
        </form>

        <div className="login-footer">
          <p>
            <small>
              Default credentials: admin@learningcenter.com / admin123
            </small>
          </p>
          <p>
            <small>
              ⚠️ Change password after first login!
            </small>
          </p>
        </div>
        
        {/* Loading overlay (optional) */}
        <div className={`loading-overlay ${loading ? 'active' : ''}`}>
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;