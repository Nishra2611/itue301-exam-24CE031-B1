export default function TrainerCard({ _id, name, specialization, available, onBook }) {
  const getInitials = (str) => {
    if (!str) return 'TR'
    return str
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <article className={`trainer-card-item ${available ? 'status-active' : 'status-disabled'}`}>
      <div className="trainer-header-row">
        <div className="trainer-avatar-box">{getInitials(name)}</div>
        <span className={`status-pill ${available ? 'pill-available' : 'pill-booked'}`}>
          {available ? 'Available' : 'Fully Booked'}
        </span>
      </div>

      <div className="trainer-details">
        <h3 className="trainer-name">{name}</h3>
        <span className="specialization-chip">{specialization}</span>
      </div>

      <div className="trainer-footer">
        {onBook ? (
          <button
            type="button"
            className={available ? 'btn-book-action' : 'btn-book-disabled'}
            disabled={!available}
            onClick={() => onBook({ _id, name, specialization })}
          >
            {available ? '📅 Book Class' : '🔒 Unavailable'}
          </button>
        ) : (
          <span className="trainer-meta">Certified FitZone Instructor</span>
        )}
      </div>
    </article>
  )
}
