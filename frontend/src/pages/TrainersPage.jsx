import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TrainerCard from '../components/TrainerCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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

  const handleBookTrainer = (trainerObj) => {
    navigate('/classes', { state: { selectedTrainerId: trainerObj._id } })
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1>FitZone Certified Trainers</h1>
          <p>Meet our elite fitness coaches & personal trainers.</p>
        </div>
      </div>

      {loading && <div className="loading-spinner">Loading trainers roster...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="trainers-grid">
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer._id}
              {...trainer}
              onBook={() => handleBookTrainer(trainer)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
