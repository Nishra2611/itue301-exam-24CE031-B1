import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export default function MyBookingsPage() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' })
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    loadBookings()
  }, [token])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBookings(response.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your class bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this class booking?')) return
    setCancellingId(bookingId)
    setActionMessage({ type: '', text: '' })
    try {
      await axios.patch(
        `${API_URL}/bookings/${bookingId}/status`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setActionMessage({ type: 'success', text: 'Booking cancelled successfully.' })
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      )
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to cancel booking'
      })
    } finally {
      setCancellingId(null)
    }
  }

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') return bookings
    return bookings.filter((b) => b.status === statusFilter)
  }, [bookings, statusFilter])

  const stats = useMemo(() => {
    const total = bookings.length
    const booked = bookings.filter((b) => b.status === 'booked').length
    const attended = bookings.filter((b) => b.status === 'attended').length
    const cancelled = bookings.filter((b) => b.status === 'cancelled').length
    return { total, booked, attended, cancelled }
  }, [bookings])

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>My Class Bookings</h1>
          <p>Track your upcoming fitness sessions, class history, and schedule.</p>
        </div>
        <Link to="/classes" className="btn-primary">
          + Book New Class
        </Link>
      </div>

      {/* Metric Cards Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{stats.total}</div>
          <div className="metric-label">Total Reserved</div>
        </div>
        <div className="metric-card metric-success">
          <div className="metric-value">{stats.booked}</div>
          <div className="metric-label">Upcoming / Booked</div>
        </div>
        <div className="metric-card metric-info">
          <div className="metric-value">{stats.attended}</div>
          <div className="metric-label">Attended</div>
        </div>
        <div className="metric-card metric-muted">
          <div className="metric-value">{stats.cancelled}</div>
          <div className="metric-label">Cancelled</div>
        </div>
      </div>

      {/* Messages */}
      {actionMessage.text && (
        <div className={`alert alert-${actionMessage.type}`}>{actionMessage.text}</div>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs-bar">
        {[
          { key: 'all', label: `All (${stats.total})` },
          { key: 'booked', label: `Booked (${stats.booked})` },
          { key: 'attended', label: `Attended (${stats.attended})` },
          { key: 'cancelled', label: `Cancelled (${stats.cancelled})` }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`tab-item ${statusFilter === tab.key ? 'tab-item-active' : ''}`}
            onClick={() => setStatusFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading && <div className="loading-spinner">Loading your bookings...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div>
          {filteredBookings.length > 0 ? (
            <div className="booking-cards-grid">
              {filteredBookings.map((booking) => (
                <article key={booking._id} className="booking-card-item">
                  <div className="booking-card-header">
                    <span className="class-title-badge">{booking.className}</span>
                    <span className={`status-badge badge-${booking.status}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="booking-info-group">
                    <div className="info-row">
                      <span className="info-icon">🏋️</span>
                      <div>
                        <strong>Trainer:</strong> {booking.trainerId?.name || 'Assigned Trainer'}
                        {booking.trainerId?.specialization && (
                          <span className="sub-text"> ({booking.trainerId.specialization})</span>
                        )}
                      </div>
                    </div>

                    <div className="info-row">
                      <span className="info-icon">📅</span>
                      <div>
                        <strong>Date:</strong> {formatDate(booking.date)}
                      </div>
                    </div>

                    <div className="info-row">
                      <span className="info-icon">⏰</span>
                      <div>
                        <strong>Time Slot:</strong> {booking.timeSlot}
                      </div>
                    </div>
                  </div>

                  <div className="booking-card-actions">
                    {booking.status === 'booked' ? (
                      <button
                        className="btn-danger-outline"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    ) : (
                      <span className="status-note">
                        {booking.status === 'attended' ? '✓ Completed' : '✕ Cancelled'}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-box">
              <h3>No bookings found</h3>
              <p>You don't have any class reservations matching this filter.</p>
              <Link to="/classes" className="btn-primary">
                Browse Available Classes
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
