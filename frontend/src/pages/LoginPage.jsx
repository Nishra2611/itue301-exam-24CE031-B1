import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { token, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) return <Navigate to="/classes" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim()) {
      setError('Please enter your registered email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(email.trim())
      navigate('/classes')
    } catch (err) {
      setError(err.response?.data?.message || 'Member account not found. Please Sign Up.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async (demoEmail) => {
    setEmail(demoEmail)
    setLoading(true)
    setError('')
    try {
      await login(demoEmail)
      navigate('/classes')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split-wrapper">
      {/* Left Artwork Banner */}
      <div className="auth-banner-side">
        <div className="auth-banner-header">
          ⚡ FITZONE<span className="brand-accent">.</span>
        </div>
        <div className="auth-banner-body">
          <h1>Transform Your Routine. Master Your Fitness.</h1>
          <p>
            Access top trainers, reserve premium studio classes, and track your fitness bookings seamlessly.
          </p>
        </div>
        <div className="auth-banner-footer">
          <p>© 2026 FitZone Performance Club. All rights reserved.</p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-header-box">
          <h2>FitZone Account Login</h2>
          <p>Enter your member credentials to access your fitness schedule.</p>
        </div>

        <div className="auth-segmented-tabs">
          <button className="tab-pill active">SIGN IN</button>
          <Link to="/signup" className="tab-pill">CREATE ACCOUNT</Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-field">
            <label htmlFor="login-email">Member Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="name@fitzone.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'SIGN IN TO FITZONE'}
          </button>
        </form>

        <div className="demo-triggers">
          <p className="demo-label">QUICK DEMO ACCOUNTS:</p>
          <div className="demo-grid">
            <button
              type="button"
              className="btn-demo-chip"
              onClick={() => quickLogin('member@fitzone.com')}
              disabled={loading}
            >
              👤 Member Demo
            </button>
            <button
              type="button"
              className="btn-demo-chip admin-chip"
              onClick={() => quickLogin('admin@fitzone.com')}
              disabled={loading}
            >
              👑 Admin Demo
            </button>
          </div>
        </div>

        <div className="auth-bottom-text">
          <p>Don't have an active membership? <Link to="/signup"><strong>Register here</strong></Link></p>
        </div>
      </div>
    </div>
  )
}
