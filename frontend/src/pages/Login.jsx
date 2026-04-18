import { useState } from 'react'
import { login, signup } from '../api'

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = tab === 'login'
        ? await login(email, password)
        : await signup(email, password)

      // Extract token from Supabase auth response
      const token =
        data?.session?.access_token ||
        data?.access_token ||
        'authenticated'

      onLogin(token)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-name">
            Sentinel<span>AI</span>
          </div>
          <div className="login-brand-sub">Threat Intelligence Platform</div>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(null) }}
          >
            Sign In
          </button>
          <button
            className={`login-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setError(null) }}
          >
            Create Account
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                {tab === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              tab === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
