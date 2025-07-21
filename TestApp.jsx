import React from 'react'

function TestApp() {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#0369a1', marginBottom: '1rem' }}>✅ React is Working!</h1>
      <p style={{ color: '#0284c7', fontSize: '1.2rem' }}>MongoDB Media Library Integration Test</p>
      <div style={{ marginTop: '2rem' }}>
        <button style={{
          padding: '1rem 2rem',
          backgroundColor: '#0284c7',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}>
          Test Button
        </button>
      </div>
    </div>
  )
}

export default TestApp
