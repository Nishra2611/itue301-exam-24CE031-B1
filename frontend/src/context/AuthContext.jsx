import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export function AuthProvider({ children }) {
  const [member, setMember] = useState(() => {
    try {
      const stored = localStorage.getItem('fitzone_member')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('fitzone_token'))
  const [role, setRole] = useState(() => localStorage.getItem('fitzone_role'))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const saveAuth = (data) => {
    setMember(data.member)
    setToken(data.token)
    setRole(data.role)
    localStorage.setItem('fitzone_member', JSON.stringify(data.member))
    localStorage.setItem('fitzone_token', data.token)
    localStorage.setItem('fitzone_role', data.role)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
  }

  const login = async (email) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email })
    const data = response.data.data
    saveAuth(data)
    return data
  }

  const register = async ({ name, email, phone, membershipType, role }) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      phone,
      membershipType,
      role
    })
    const data = response.data.data
    saveAuth(data)
    return response.data
  }

  const logout = () => {
    setMember(null)
    setToken(null)
    setRole(null)
    localStorage.removeItem('fitzone_member')
    localStorage.removeItem('fitzone_token')
    localStorage.removeItem('fitzone_role')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = useMemo(
    () => ({ member, token, role, login, register, logout }),
    [member, token, role]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
