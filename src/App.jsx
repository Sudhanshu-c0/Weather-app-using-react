import { useState } from 'react'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

// Map weather condition codes to gradient themes and emojis
function getWeatherTheme(conditionCode, isNight) {
  if (!conditionCode) return { gradient: 'var(--grad-default)', emoji: '🌍' }
  const c = conditionCode

  if (c >= 200 && c < 300) return { gradient: 'var(--grad-thunder)', emoji: '⛈️' }
  if (c >= 300 && c < 400) return { gradient: 'var(--grad-drizzle)', emoji: '🌦️' }
  if (c >= 500 && c < 600) return { gradient: 'var(--grad-rain)',    emoji: '🌧️' }
  if (c >= 600 && c < 700) return { gradient: 'var(--grad-snow)',    emoji: '❄️' }
  if (c >= 700 && c < 800) return { gradient: 'var(--grad-mist)',    emoji: '🌫️' }
  if (c === 800)            return isNight
    ? { gradient: 'var(--grad-clear-night)', emoji: '🌙' }
    : { gradient: 'var(--grad-clear)',       emoji: '☀️' }
  if (c > 800)              return { gradient: 'var(--grad-cloudy)',  emoji: '☁️' }
  return { gradient: 'var(--grad-default)', emoji: '🌍' }
}

function formatTime(unixTs, timezoneOffset) {
  const localMs = (unixTs + timezoneOffset) * 1000
  const d = new Date(localMs)
  return d.toUTCString().slice(-12, -7)  // "HH:MM"
}

function WindIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
    </svg>
  )
}

function HumidityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  )
}

function VisibilityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function SunriseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0"/>
      <line x1="12" y1="2" x2="12" y2="9"/>
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/>
      <line x1="1" y1="18" x2="3" y2="18"/>
      <line x1="21" y1="18" x2="23" y2="18"/>
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/>
      <line x1="23" y1="22" x2="1" y2="22"/>
      <polyline points="8 6 12 2 16 6"/>
    </svg>
  )
}

function FeelsLikeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
    </svg>
  )
}

function PressureIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  )
}

export default function App() {
  const [city, setCity]       = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [theme, setTheme]     = useState({ gradient: 'var(--grad-default)', emoji: '🌍' })

  async function fetchWeather(e) {
    e.preventDefault()
    const trimmed = city.trim()
    if (!trimmed) return

    if (!API_KEY || API_KEY === 'your_api_key_here') {
      setError('⚠️ API key missing! Please add your OpenWeatherMap key to the .env file as VITE_WEATHER_API_KEY.')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmed)}&appid=${API_KEY}&units=metric`
      )
      if (!res.ok) {
        if (res.status === 404) throw new Error(`City "${trimmed}" not found. Please check the spelling.`)
        if (res.status === 401) throw new Error('Invalid API key. Please check your .env file.')
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }
      const data = await res.json()
      setWeather(data)
      // Determine night/day from local time
      const localNow = (Date.now() / 1000) + data.timezone
      const isNight  = localNow < data.sys.sunrise + data.timezone || localNow > data.sys.sunset + data.timezone
      setTheme(getWeatherTheme(data.weather[0].id, isNight))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const bgStyle = { background: theme.gradient }

  return (
    <div className="app" style={bgStyle}>
      {/* Animated blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <span className="logo-icon">🌤️</span>
            <span className="logo-text">WeatherNow</span>
          </div>
          <p className="tagline">Real-time weather at your fingertips</p>
        </header>

        {/* Search */}
        <form className="search-form" onSubmit={fetchWeather} id="search-form">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              id="city-input"
              className="search-input"
              type="text"
              placeholder="Enter city name…"
              value={city}
              onChange={e => setCity(e.target.value)}
              autoComplete="off"
              spellCheck="false"
            />
            <button id="search-btn" className="search-btn" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Search'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="error-card" id="error-message">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="skeleton-card">
            <div className="skeleton sk-title" />
            <div className="skeleton sk-sub" />
            <div className="skeleton sk-temp" />
            <div className="skeleton-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton sk-stat" />)}
            </div>
          </div>
        )}

        {/* Weather Result */}
        {weather && !loading && (
          <div className="weather-card" id="weather-result">
            {/* City & Country */}
            <div className="city-header">
              <h1 className="city-name">
                {weather.name}
                <span className="country-badge">{weather.sys.country}</span>
              </h1>
              <p className="local-time">
                🕐 Local time: {formatTime(Math.floor(Date.now() / 1000), weather.timezone)}
              </p>
            </div>

            {/* Main temp */}
            <div className="main-weather">
              <div className="weather-emoji">{theme.emoji}</div>
              <div className="temp-block">
                <span className="temperature">{Math.round(weather.main.temp)}°</span>
                <span className="temp-unit">C</span>
              </div>
              <div className="condition-block">
                <p className="condition">{weather.weather[0].description}</p>
                <p className="temp-range">
                  ↑ {Math.round(weather.main.temp_max)}° &nbsp; ↓ {Math.round(weather.main.temp_min)}°
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* Stats grid */}
            <div className="stats-grid">
              <StatCard icon={<FeelsLikeIcon />} label="Feels like"   value={`${Math.round(weather.main.feels_like)}°C`} />
              <StatCard icon={<HumidityIcon />}  label="Humidity"     value={`${weather.main.humidity}%`} />
              <StatCard icon={<WindIcon />}       label="Wind speed"   value={`${weather.wind.speed} m/s`} />
              <StatCard icon={<PressureIcon />}   label="Pressure"     value={`${weather.main.pressure} hPa`} />
              <StatCard icon={<VisibilityIcon />} label="Visibility"   value={`${(weather.visibility / 1000).toFixed(1)} km`} />
              <StatCard icon={<SunriseIcon />}    label="Sunrise"      value={formatTime(weather.sys.sunrise, weather.timezone)} />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!weather && !loading && !error && (
          <div className="empty-state" id="empty-state">
            <div className="empty-globe">🌐</div>
            <p>Search for any city to see the current weather</p>
          </div>
        )}
      </div>
    </div>
  )
}
