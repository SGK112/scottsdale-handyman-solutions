import React, { useState } from 'react'
import { Phone, Wrench, Home } from 'lucide-react'

function App() {
    const [currentPage, setCurrentPage] = useState('home')

    return (
        <div className="App">
            <h1>Test Handyman Website</h1>
            <nav>
                <button onClick={() => setCurrentPage('home')}>Home</button>
                <button onClick={() => setCurrentPage('services')}>Services</button>
            </nav>

            {currentPage === 'home' && (
                <div>
                    <h2>Home Page</h2>
                    <p>Welcome to our handyman service!</p>
                </div>
            )}

            {currentPage === 'services' && (
                <div>
                    <h2>Services Page</h2>
                    <div>
                        <Wrench size={24} />
                        <h3>Plumbing</h3>
                    </div>
                    <div>
                        <Home size={24} />
                        <h3>Painting</h3>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
