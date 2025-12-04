import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Search, Filter, X } from 'lucide-react';
import MapaBase from '../components/map/MapaBase';
import { obtenerPartidos } from '../services/partidosService';
import { useGeolocation, calcularDistancia } from '../hooks/useGeolocation';
import { useAuth } from '../contexts/AuthContext';

export default function MapaPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [partidos, setPartidos] = useState([]);
  const [partidosFiltrados, setPartidosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    formato: '',
    distancia: 50, // km
    fecha: 'todas'
  });

  const { location: userLocation, loading: locationLoading, obtenerUbicacion } = useGeolocation();

  useEffect(() => {
    cargarPartidos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [partidos, filtros, userLocation]);

  const cargarPartidos = async () => {
    try {
      setLoading(true);
      const data = await obtenerPartidos();
      
      // Filtrar solo partidos con coordenadas
      const partidosConUbicacion = data.filter(p => p.lat && p.lng);
      setPartidos(partidosConUbicacion);
    } catch (error) {
      console.error('Error al cargar partidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...partidos];

    // Filtrar por formato
    if (filtros.formato) {
      resultado = resultado.filter(p => p.nombreFormato === filtros.formato);
    }

    // Filtrar por distancia si tenemos ubicación del usuario
    if (userLocation && filtros.distancia) {
      resultado = resultado.map(partido => {
        const distancia = calcularDistanciaKm(
          userLocation.lat,
          userLocation.lng,
          partido.lat,
          partido.lng
        );
        return { ...partido, distancia };
      }).filter(p => p.distancia <= filtros.distancia);

      // Ordenar por distancia
      resultado.sort((a, b) => a.distancia - b.distancia);
    }

    // Filtrar por fecha
    if (filtros.fecha === 'hoy') {
      const hoy = new Date().toISOString().split('T')[0];
      resultado = resultado.filter(p => p.fecha === hoy);
    } else if (filtros.fecha === 'semana') {
      const hoy = new Date();
      const unaSemana = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
      resultado = resultado.filter(p => {
        const fechaPartido = new Date(p.fecha);
        return fechaPartido >= hoy && fechaPartido <= unaSemana;
      });
    }

    setPartidosFiltrados(resultado);
  };

  const calcularDistanciaKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handlePartidoClick = (partido) => {
    navigate(`/partidos/${partido.id}`);
  };

  const formatosDisponibles = [...new Set(partidos.map(p => p.nombreFormato))];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <MapPin className="w-8 h-8" />
          Mapa de Partidos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Encontrá los partidos más cercanos a tu ubicación
        </p>
      </div>

      {/* Controles */}
      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={obtenerUbicacion}
          disabled={locationLoading}
          className="btn-primary flex items-center gap-2"
        >
          <Navigation className={`w-5 h-5 ${locationLoading ? 'animate-spin' : ''}`} />
          {locationLoading ? 'Obteniendo...' : 'Mi Ubicación'}
        </button>

        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="btn-secondary flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          Filtros
          {(filtros.formato || filtros.fecha !== 'todas') && (
            <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
              {[filtros.formato, filtros.fecha !== 'todas'].filter(Boolean).length}
            </span>
          )}
        </button>

        {userLocation && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Ubicación detectada</span>
          </div>
        )}

        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400 flex items-center">
          {partidosFiltrados.length} partidos encontrados
        </div>
      </div>

      {/* Panel de Filtros */}
      {mostrarFiltros && (
        <div className="card mb-4 p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filtros de búsqueda</h3>
            <button
              onClick={() => setMostrarFiltros(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Formato */}
            <div>
              <label className="block text-sm font-medium mb-2">Formato</label>
              <select
                value={filtros.formato}
                onChange={(e) => setFiltros({ ...filtros, formato: e.target.value })}
                className="input-field w-full"
              >
                <option value="">Todos los formatos</option>
                {formatosDisponibles.map(formato => (
                  <option key={formato} value={formato}>{formato}</option>
                ))}
              </select>
            </div>

            {/* Distancia */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Distancia máxima: {filtros.distancia}km
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={filtros.distancia}
                onChange={(e) => setFiltros({ ...filtros, distancia: parseInt(e.target.value) })}
                disabled={!userLocation}
                className="w-full"
              />
              {!userLocation && (
                <p className="text-xs text-gray-500 mt-1">
                  Activa tu ubicación para usar este filtro
                </p>
              )}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <select
                value={filtros.fecha}
                onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })}
                className="input-field w-full"
              >
                <option value="todas">Todas las fechas</option>
                <option value="hoy">Hoy</option>
                <option value="semana">Esta semana</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setFiltros({ formato: '', distancia: 50, fecha: 'todas' })}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Mapa */}
      <div className="card p-0 overflow-hidden" style={{ height: 'calc(100vh - 350px)' }}>
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando partidos...</p>
            </div>
          </div>
        ) : (
          <MapaBase
            partidos={partidosFiltrados}
            userLocation={userLocation}
            onPartidoClick={handlePartidoClick}
            className="h-full"
          />
        )}
      </div>

      {/* Lista de partidos debajo del mapa (móvil) */}
      <div className="mt-6 md:hidden">
        <h3 className="font-semibold mb-3">Lista de partidos</h3>
        <div className="space-y-3">
          {partidosFiltrados.slice(0, 5).map(partido => (
            <div
              key={partido.id}
              onClick={() => handlePartidoClick(partido)}
              className="card p-4 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{partido.nombreFormato}</h4>
                {partido.distancia && (
                  <span className="text-sm text-primary font-medium">
                    {partido.distancia < 1 
                      ? `${Math.round(partido.distancia * 1000)}m`
                      : `${partido.distancia.toFixed(1)}km`
                    }
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📅 {partido.fecha} • {partido.hora}hs
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📍 {partido.barrio}, {partido.localidad}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                👥 {partido.jugadores?.length || 1}/{partido.jugadoresMaximos}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
