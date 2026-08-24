import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navigation() {
  const { member, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitials = (name) => {
    if (!name) return 'FZ'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="nav-header">
      <div className="nav-container">
        <Link to={member ? '/classes' : '/login'} className="brand-logo">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">Fit<span className="brand-accent">Zone</span></span>
        </Link>

        <nav className="nav-links">
          {member ? (
            <>
              <NavLink to="/classes" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Classes
              </NavLink>
              <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                My Bookings
              </NavLink>
              <NavLink to="/trainers" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Trainers
              </NavLink>
              {role === 'Admin' && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active admin-link' : 'nav-link admin-link')}>
                  Admin Panel 👑
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Login
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Sign Up
              </NavLink>
            </>
          )}
        </nav>

        <div className="nav-user-area">
          {member ? (
            <div className="user-profile-pill">
              <div className="avatar-circle">{getInitials(member.name)}</div>
              <div className="user-info">
                <span className="user-name">{member.name}</span>
                <span className={`role-badge ${role === 'Admin' ? 'badge-admin' : 'badge-member'}`}>
                  {role === 'Admin' ? 'Admin' : (member.membershipType || 'Member')}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Sign out of FitZone">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary-sm">Login</Link>
              <Link to="/signup" className="btn-primary-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
