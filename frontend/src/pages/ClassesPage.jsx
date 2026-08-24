import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const TIME_SLOTS = [
  '06:00 AM - 07:00 AM',
  '07:30 AM - 08:30 AM',
  '09:00 AM - 10:00 AM',
  '05:00 PM - 06:00 PM',
  '06:30 PM - 07:30 PM',
  '08:00 PM - 09:00 PM'
]

export default function ClassesPage() {
  const { token, member } = useAuth()
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  // Booking Form State
  const [selectedTrainer, setSelectedTrainer] = useState('')
  const [className, setClassName] = useState('')
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0])
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadTrainers()
  }, [])

  const loadTrainers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/trainers`)
      setTrainers(response.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load trainers')
    } finally {
      setLoading(false)
    }
  }

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const matchesSearch =
        trainer.name.toLowerCase().includes(search.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        activeCategory === 'All' ||
        trainer.specialization.toLowerCase().includes(activeCategory.toLowerCase())
      return matchesSearch && matchesCategory
    })
  }, [trainers, search, activeCategory])

  const handleSelectTrainerToBook = (trainerObj) => {
    setSelectedTrainer(trainerObj._id)
    setClassName(`${trainerObj.specialization.split('&')[0].trim()} Session`)
    setBookingMessage({ type: '', text: '' })
  }

  const handleBooking = async (event) => {
    event.preventDefault()
    setBookingMessage({ type: '', text: '' })

    if (!selectedTrainer) {
      setBookingMessage({ type: 'danger', text: 'Please select a trainer first' })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(
        `${API_URL}/bookings`,
        {
          trainerId: selectedTrainer,
          className: className.trim() || 'Fitness Session',
          date,
          timeSlot
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setBookingMessage({ type: 'success', text: response.data.message || 'Class reserved successfully!' })
      setClassName('')
      setDate('')
    } catch (err) {
      setBookingMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Booking failed. Slot may already be reserved.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'TR'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="page-wrapper">
      {/* Top Header Bar */}
      <div className="page-header">
        <div>
          <h1>Explore Classes</h1>
          <p>Book your studio workouts with FitZone certified elite coaches.</p>
        </div>
        <div className="user-greeting">
          <span>Welcome back, <strong>{member?.name || 'Athlete'}</strong></span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="🔍 Search by class name or trainer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="category-pills">
          {['All', 'Strength', 'Yoga', 'HIIT', 'Boxing'].map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Cards + Side Reservation Panel */}
      <div className="classes-main-layout">
        {/* Left Cards Roster */}
        <div className="cards-section">
          {loading && <div className="loading-spinner">Loading available trainers & classes...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              {filteredTrainers.length > 0 ? (
                <div className="cards-grid">
                  {filteredTrainers.map((trainer) => (
                    <article key={trainer._id} className="class-card">
                      <div className="class-card-header">
                        <span className="spec-tag">{trainer.specialization}</span>
                        <span className={`avail-pill ${trainer.available ? 'available' : 'booked'}`}>
                          {trainer.available ? 'Available' : 'Booked'}
                        </span>
                      </div>

                      <div className="trainer-meta-row">
                        <div className="trainer-avatar-sm">{getInitials(trainer.name)}</div>
                        <div className="trainer-info-text">
                          <h4>{trainer.name}</h4>
                          <p>Certified FitZone Coach</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-book-now"
                        disabled={!trainer.available}
                        onClick={() => handleSelectTrainerToBook(trainer)}
                      >
                        {trainer.available ? 'BOOK SESSION' : 'UNAVAILABLE'}
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-box">
                  <h3>No classes found</h3>
                  <p>No trainers match your search filters.</p>
                  <button className="btn-secondary" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Session Reservation Panel */}
        <div className="side-panel">
          <h3 className="panel-title">📅 Reserve Class Session</h3>

          {bookingMessage.text && (
            <div className={`alert alert-${bookingMessage.type}`}>
              {bookingMessage.text}
            </div>
          )}

          <form onSubmit={handleBooking} className="form-stack">
            <div className="form-field">
              <label>Select Trainer</label>
              <select
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
                required
              >
                <option value="">-- Choose Coach --</option>
                {trainers.map((t) => (
                  <option key={t._id} value={t._id} disabled={!t.available}>
                    {t.name} ({t.specialization}) {!t.available ? '[Booked]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Class Name</label>
              <input
                type="text"
                placeholder="e.g. Strength Training, Yoga Flow"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Booking Date</label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Time Slot</label>
              <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-red btn-block" disabled={isSubmitting}>
              {isSubmitting ? 'RESERVING...' : 'CONFIRM CLASS BOOKING'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
