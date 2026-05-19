import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import AdminPage from './pages/AdminPage.jsx'
import WishingPage from './pages/WishingPage.jsx'
import LandingPage from './pages/LandingPage.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/wishing" element={<WishingPage />} />
      </Routes>
    </HashRouter>
  )
}
