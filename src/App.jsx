import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Lenis from '@studio-freight/lenis'
import { Helmet } from 'react-helmet-async'
import { useAuth } from './context/AuthContext'

import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'
import GoldCursor from './components/GoldCursor'
import AdminLogin from './pages/AdminLogin'
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const GalleryDetail = lazy(() => import('./pages/GalleryDetail'))

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Nakshatra Events',
  alternateName: 'Mahadeva Management',
  description:
    'Premium event planning and management across Karnataka. Weddings, corporate events, product launches, mehandi, DJ & sangeet, themed varmala, photography, and celebrations in Shimoga, Bangalore, Mysore, Mangalore, and all major cities of Karnataka.',
  telephone: ['+91-9740904242', '+91-8951403242'],
  email: 'rashmirs1989@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Gopala Bus Stop, Gopala',
    addressLocality: 'Shimoga',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  founder: { '@type': 'Person', name: 'Rashmi Satish' },
  areaServed: [
    'Shimoga', 'Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Dharwad',
    'Davangere', 'Tumkur', 'Hassan', 'Udupi', 'Chikmagalur', 'Sagara',
    'Belgaum', 'Bellary', 'Gulbarga', 'Mandya', 'Kodagu', 'Karnataka',
  ],
}

function PublicLayout() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    })
    let rafId
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  return (
    <>
      <Helmet>
        <title>Nakshatra Events | Wedding &amp; Event Planner across Karnataka</title>
        <meta name="description" content="Nakshatra Events by Mahadeva Management — premium event planning across Karnataka. Weddings, corporate events, product launches, mehandi, DJ sangeet, and photography in Shimoga, Bangalore, Mysore, Mangalore and beyond." />
        <meta name="keywords" content="event planner Shimoga, wedding planner Karnataka, Nakshatra Events Shimoga, event management Karnataka, wedding decorator Shimoga, corporate event Bangalore, mehandi artist Karnataka, DJ sangeet Karnataka, product launch event Karnataka, themed varmala Karnataka, photography events Karnataka, Rashmi Satish event planner, Mahadeva Management Shimoga" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Nakshatra Events | Event Planner across Karnataka" />
        <meta property="og:description" content="Transforming moments, creating memories. Premium event planning across Shimoga, Bangalore, Mysore, Mangalore and all of Karnataka." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
    </>
  )
}

function ProtectedRoute({ children }) {
  const { token, checking } = useAuth()
  if (checking) return <div style={{ background: 'var(--bg)', minHeight: '100vh' }} />
  return token ? children : <Navigate to="/admin/login" replace />
}

const PageLoader = () => <div style={{ background: 'var(--bg)', minHeight: '100vh' }} />

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <GoldCursor />
      <Routes>
        <Route path="/" element={<PublicLayout />} />
        <Route path="/gallery/:category" element={<GalleryDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
