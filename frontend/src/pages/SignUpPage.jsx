import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
  const { token, register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: 'basic'
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) return <Navigate to="/classes" replace />

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, phone } = formData

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address')
      return
    }

    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      setError('Phone number must contain at least 10 digits')
      return
    }

    setLoading(true)
    setError('')
    try {
      await register(formData)
      setSuccess('Account registered successfully! Redirecting...')
      setTimeout(() => {
        navigate('/classes')
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
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
          <h1>Start Your Fitness Journey Today.</h1>
          <p>
            Join thousands of active FitZone members enjoying world-class coaching & high-energy classes.
          </p>
        </div>
        <div className="auth-banner-footer">
          <p>© 2026 FitZone Performance Club.</p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-header-box">
          <h2>Create FitZone Account</h2>
          <p>Fill in your member details to register your pass.</p>
        </div>

        <div className="auth-segmented-tabs">
          <Link to="/login" className="tab-pill">SIGN IN</Link>
          <button className="tab-pill active">CREATE ACCOUNT</button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-field">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              placeholder="Nishra Gajkandh"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="nishra@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="signup-phone">Phone Number</label>
            <input
              id="signup-phone"
              name="phone"
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="signup-membership">Membership Tier</label>
            <select
              id="signup-membership"
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
            >
              <option value="basic">Basic Membership Pass</option>
              <option value="premium">Premium All-Access Pass</option>
              <option value="platinum">Platinum VIP Trainer Access</option>
            </select>
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? 'REGISTERING...' : 'REGISTER FITZONE ACCOUNT'}
          </button>
        </form>

        <div className="auth-bottom-text">
          <p>Already have an account? <Link to="/login"><strong>Sign In here</strong></Link></p>
        </div>
      </div>
    </div>
  )
}
