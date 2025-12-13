import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import InstallButton from './components/common/InstallButton'

// Pages Públicas
import LandingPage from './pages/LandingPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import LoginPage from './pages/LoginPage'

// Pages Privadas (App)
import HomePage from './pages/HomePage'
import PerfilPage from './pages/PerfilPage'
import CrearPartidoPage from './pages/CrearPartidoPage'
import PartidosPage from './pages/PartidosPage'
import DetallePartidoPage from './pages/DetallePartidoPage'
import MapaPage from './pages/MapaPage'
import SoloQueuePage from './pages/SoloQueuePage'
import WaitingRoomPage from './pages/WaitingRoomPage'

// Componente de ruta protegida - Redirige a login si no hay usuario
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? (
    <>
      {children}
      <InstallButton />
    </>
  ) : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-grass-pattern">
      <Routes>
        {/* ==================== RUTAS PÚBLICAS ==================== */}
        
        {/* Landing Page - Primera página que ve el usuario */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Política de Privacidad - Requisito para AdSense */}
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        
        {/* Login/Registro */}
        <Route path="/login" element={<LoginPage />} />
        
        
        {/* ==================== RUTAS PROTEGIDAS (APP) ==================== */}
        
        {/* Dashboard - Home de la aplicación */}
        <Route path="/app" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        {/* Perfil del usuario */}
        <Route path="/app/perfil" element={
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        } />
        
        {/* Listado de partidos */}
        <Route path="/app/partidos" element={
          <ProtectedRoute>
            <PartidosPage />
          </ProtectedRoute>
        } />
        
        {/* Crear nuevo partido */}
        <Route path="/app/partidos/crear" element={
          <ProtectedRoute>
            <CrearPartidoPage />
          </ProtectedRoute>
        } />
        
        {/* Detalle de un partido específico */}
        <Route path="/app/partidos/:id" element={
          <ProtectedRoute>
            <DetallePartidoPage />
          </ProtectedRoute>
        } />
        
        {/* Mapa de canchas */}
        <Route path="/app/mapa" element={
          <ProtectedRoute>
            <MapaPage />
          </ProtectedRoute>
        } />
        
        {/* Sistema de matchmaking */}
        <Route path="/app/solo-queue" element={
          <ProtectedRoute>
            <SoloQueuePage />
          </ProtectedRoute>
        } />
        
        {/* Sala de espera con juegos */}
        <Route path="/app/sala-de-espera" element={
          <ProtectedRoute>
            <WaitingRoomPage />
          </ProtectedRoute>
        } />
        
        {/* Ruta por defecto - Redirige a la landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
