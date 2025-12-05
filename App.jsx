import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import InstallButton from './components/common/InstallButton'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PerfilPage from './pages/PerfilPage'
import CrearPartidoPage from './pages/CrearPartidoPage'
import PartidosPage from './pages/PartidosPage'
import DetallePartidoPage from './pages/DetallePartidoPage'
import MapaPage from './pages/MapaPage'
import SoloQueuePage from './pages/SoloQueuePage'
import WaitingRoomPage from './pages/WaitingRoomPage'

// Componente de ruta protegida
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
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/perfil" element={
          <ProtectedRoute>
            <PerfilPage />
          </ProtectedRoute>
        } />
        
        <Route path="/partidos" element={
          <ProtectedRoute>
            <PartidosPage />
          </ProtectedRoute>
        } />
        
        <Route path="/partidos/crear" element={
          <ProtectedRoute>
            <CrearPartidoPage />
          </ProtectedRoute>
        } />
        
        <Route path="/partidos/:id" element={
          <ProtectedRoute>
            <DetallePartidoPage />
          </ProtectedRoute>
        } />
        
        <Route path="/mapa" element={
          <ProtectedRoute>
            <MapaPage />
          </ProtectedRoute>
        } />
        
        <Route path="/solo-queue" element={
          <ProtectedRoute>
            <SoloQueuePage />
          </ProtectedRoute>
        } />
        
        <Route path="/sala-de-espera" element={
          <ProtectedRoute>
            <WaitingRoomPage />
          </ProtectedRoute>
        } />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
