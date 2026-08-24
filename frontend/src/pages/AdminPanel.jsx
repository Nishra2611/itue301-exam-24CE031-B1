import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export default function AdminPanel() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState('bookings')

  const [members, setMembers] = useState([])
  const [trainers, setTrainers] = useState([])
  const [bookings, setBookings] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const [showMemberModal, setShowMemberModal] = useState(false)
  const [memberForm, setMemberForm] = useState({ name: '', email: '', phone: '', membershipType: 'basic', role: 'Member' })

  const [showTrainerModal, setShowTrainerModal] = useState(false)
  const [trainerForm, setTrainerForm] = useState({ name: '', specialization: '', available: true })

  useEffect(() => {
    loadAllData()
  }, [token])

  const loadAllData = async () => {
    setLoading(true)
    setError('')
    try {
      const [membersRes, trainersRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/members`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/trainers`),
        axios.get(`${API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      setMembers(membersRes.data.data || [])
      setTrainers(trainersRes.data.data || [])
      setBookings(bookingsRes.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load administrative data')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 4000)
  }

  const handleCreateMember = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}/members`, memberForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('success', res.data.message || 'Member added successfully')
      setShowMemberModal(false)
      setMemberForm({ name: '', email: '', phone: '', membershipType: 'basic', role: 'Member' })
      loadAllData()
    } catch (err) {
      showNotification('danger', err.response?.data?.message || 'Failed to create member')
    }
  }

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Delete member record?')) return
    try {
      await axios.delete(`${API_URL}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('success', 'Member deleted')
      loadAllData()
    } catch (err) {
      showNotification('danger', err.response?.data?.message || 'Failed to delete member')
    }
  }

  const handleCreateTrainer = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_URL}/trainers`, trainerForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('success', res.data.message || 'Trainer added successfully')
      setShowTrainerModal(false)
      setTrainerForm({ name: '', specialization: '', available: true })
      loadAllData()
    } catch (err) {
      showNotification('danger', err.response?.data?.message || 'Failed to add trainer')
    }
  }

  const handleToggleTrainerAvailability = async (trainerId, currentAvailable) => {
    try {
      await axios.patch(`${API_URL}/trainers/${trainerId}`, { available: !currentAvailable }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('success', 'Trainer availability updated')
      loadAllData()
    } catch (err) {
      showNotification('danger', err.response?.data?.message || 'Failed to update trainer')
    }
  }

  const handleDeleteTrainer = async (trainerId) => {
    if (!window.confirm('Delete trainer profile?')) return
    try {
      await axios.delete(`${API_URL}/trainers/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('success', 'Trainer removed')
      loadAllData()
    } catch (err) {
      showNotification('danger', err.response?.data?.message || 'Failed to delete trainer')
    }
  }

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/bookings/${bookingId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('success', `Status updated to ${newStatus}`)
      loadAllData()
    } catch (err) {
      showNotification('danger', err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Remove booking record?')) return
    try {
      await axios.delete(`${API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showNotification('success', 'Booking removed')
      loadAllData()
    } catch (err) {
      showNotification('danger', err.response?.data?.message || 'Failed to delete booking')
    }
  }

  const getInitials = (name) => {
    if (!name) return 'MB'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div>
      {/* Top Header */}
      <div className="page-top-bar">
        <div className="page-title">
          <h1>Overview</h1>
          <p>FitZone Admin Studio Management & Roster Analytics.</p>
        </div>
        <div className="admin-actions">
          <button className="btn-primary" onClick={() => setShowMemberModal(true)}>
            + CREATE SESSION / MEMBER
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="metrics-row">
        <div className="stat-card">
          <div className="stat-card-title">TOTAL MEMBERS</div>
          <div className="stat-card-num">{members.length || 12}</div>
          <div className="stat-card-sub">↑ +12% this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">ACTIVE TRAINERS</div>
          <div className="stat-card-num">{trainers.length || 4}</div>
          <div className="stat-card-sub">↑ {trainers.filter(t => t.available).length} Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">RECENT BOOKINGS</div>
          <div className="stat-card-num">{bookings.length || 8}</div>
          <div className="stat-card-sub">↑ Active schedule</div>
        </div>
      </div>

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabs Row */}
      <div className="admin-tabs-bar">
        <button
          className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Recent Bookings ({bookings.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members ({members.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'trainers' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainers')}
        >
          Trainers ({trainers.length})
        </button>
      </div>

      {/* TAB CONTENT */}
      {loading ? (
        <div className="loading-spinner">Loading admin records...</div>
      ) : (
        <div className="admin-pane">
          {/* TAB 1: RECENT BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>MEMBER</th>
                    <th>CLASS</th>
                    <th>TIME / DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>
                        <div className="trainer-meta-row">
                          <div className="trainer-avatar-sm">{getInitials(b.memberId?.name)}</div>
                          <div>
                            <strong>{b.memberId?.name || 'Member'}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.memberId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><strong>{b.className}</strong></td>
                      <td>{b.timeSlot} <br /><span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(b.date).toLocaleDateString()}</span></td>
                      <td>
                        <span className={`status-badge-pill status-${b.status}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={b.status}
                          style={{ padding: '4px 8px', fontSize: '0.8rem', marginRight: '8px' }}
                          onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                        >
                          <option value="booked">Booked</option>
                          <option value="attended">Attended</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          className="btn-danger-outline"
                          onClick={() => handleDeleteBooking(b._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No bookings logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: MEMBERS */}
          {activeTab === 'members' && (
            <div>
              {showMemberModal && (
                <form onSubmit={handleCreateMember} className="side-panel" style={{ marginBottom: '20px' }}>
                  <h3>Add Member Record</h3>
                  <div className="form-stack">
                    <input
                      placeholder="Full Name"
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={memberForm.email}
                      onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                      required
                    />
                    <input
                      placeholder="Phone Number"
                      value={memberForm.phone}
                      onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                      required
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className="btn-primary">Save Member</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowMemberModal(false)}>Cancel</button>
                    </div>
                  </div>
                </form>
              )}

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>PHONE</th>
                      <th>MEMBERSHIP</th>
                      <th>ROLE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m._id}>
                        <td><strong>{m.name}</strong></td>
                        <td>{m.email}</td>
                        <td>{m.phone}</td>
                        <td><span className="spec-tag">{m.membershipType}</span></td>
                        <td><strong>{m.role}</strong></td>
                        <td>
                          <button
                            className="btn-danger-outline"
                            onClick={() => handleDeleteMember(m._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TRAINERS */}
          {activeTab === 'trainers' && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <button className="btn-secondary" onClick={() => setShowTrainerModal(!showTrainerModal)}>
                  + Add New Trainer
                </button>
              </div>

              {showTrainerModal && (
                <form onSubmit={handleCreateTrainer} className="side-panel" style={{ marginBottom: '20px' }}>
                  <h3>Add Trainer Record</h3>
                  <div className="form-stack">
                    <input
                      placeholder="Trainer Name"
                      value={trainerForm.name}
                      onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })}
                      required
                    />
                    <input
                      placeholder="Specialization"
                      value={trainerForm.specialization}
                      onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })}
                      required
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className="btn-primary">Save Trainer</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowTrainerModal(false)}>Cancel</button>
                    </div>
                  </div>
                </form>
              )}

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>SPECIALIZATION</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainers.map((t) => (
                      <tr key={t._id}>
                        <td><strong>{t.name}</strong></td>
                        <td><span className="spec-tag">{t.specialization}</span></td>
                        <td>
                          <span className={`status-badge-pill ${t.available ? 'status-booked' : 'status-cancelled'}`}>
                            {t.available ? 'Available' : 'Booked'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-secondary-sm"
                            style={{ marginRight: '8px' }}
                            onClick={() => handleToggleTrainerAvailability(t._id, t.available)}
                          >
                            Toggle Availability
                          </button>
                          <button
                            className="btn-danger-outline"
                            onClick={() => handleDeleteTrainer(t._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
