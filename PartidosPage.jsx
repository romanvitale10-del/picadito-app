import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import AdSlot from '../components/ads/AdSlot';
import { obtenerPartidos } from '../services/partidosService';
import { 
  MapPin, Users, Clock, Calendar, Star, Filter, 
  Search, Plus, TrendingUp 
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PartidosPage() {
  const location = useLocation();
  const [partidos, setPartidos] = useState([]);
  const [partidosFiltrados, setPartidosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    formato: 'todos',
    provincia: '',
    nivel: 'todos',
    soloDisponibles: true
  });

  // Recargar partidos cuando se navega a esta página
  useEffect(() => {
    cargarPartidos();
  }, [location]);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, partidos]);

  const cargarPartidos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando partidos...');
      const data = await obtenerPartidos();
      console.log('✅ Partidos cargados:', data.length);
      setPartidos(data);
    } catch (error) {
      console.error('❌ Error al cargar partidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...partidos];

    // Búsqueda por texto
    if (filtros.busqueda) {
      resultado = resultado.filter(p =>
        p.localidad?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        p.barrio?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        p.nombreCancha?.toLowerCase().includes(filtros.busqueda.toLowerCase())
      );
    }

    // Filtro por formato
    if (filtros.formato !== 'todos') {
      resultado = resultado.filter(p => p.formato === filtros.formato);
    }

    // Filtro por provincia
    if (filtros.provincia) {
      resultado = resultado.filter(p => 
        p.provincia?.toLowerCase().includes(filtros.provincia.toLowerCase())
      );
    }

    // Filtro por nivel
    if (filtros.nivel !== 'todos') {
      resultado = resultado.filter(p => p.nivel === filtros.nivel || p.nivel === 'todos');
    }

    // Solo disponibles
    if (filtros.soloDisponibles) {
      resultado = resultado.filter(p => 
        p.jugadores.length < p.jugadoresMaximos
      );
    }

    setPartidosFiltrados(resultado);
  };

  const handleFiltroChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros({
      ...filtros,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const formatearFecha = (fechaStr) => {
    try {
      const fecha = new Date(fechaStr + 'T00:00:00');
      return format(fecha, "EEEE d 'de' MMMM", { locale: es });
    } catch {
      return fechaStr;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container-app py-6">
          <div className="flex items-center justify-center h-64">
            <div className="spinner w-12 h-12" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="container-app py-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ⚽ Partidos Disponibles
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {partidosFiltrados.length} {partidosFiltrados.length === 1 ? 'partido encontrado' : 'partidos encontrados'}
            </p>
          </div>

          <Link to="/app/partidos/crear" className="btn-primary flex items-center gap-2 justify-center">
            <Plus className="w-5 h-5" />
            Crear Partido
          </Link>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="busqueda"
                value={filtros.busqueda}
                onChange={handleFiltroChange}
                className="input-field pl-10"
                placeholder="Buscar por ubicación o cancha..."
              />
            </div>

            {/* Botón Filtros */}
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="btn-secondary flex items-center gap-2 justify-center"
            >
              <Filter className="w-5 h-5" />
              Filtros
              {Object.values(filtros).some(v => v && v !== 'todos' && v !== true) && (
                <span className="badge bg-primary text-white ml-1">●</span>
              )}
            </button>
          </div>

          {/* Panel de Filtros Expandible */}
          {mostrarFiltros && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid md:grid-cols-4 gap-4 fade-in">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Formato
                </label>
                <select
                  name="formato"
                  value={filtros.formato}
                  onChange={handleFiltroChange}
                  className="input-field text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="futbol5">Fútbol 5</option>
                  <option value="futbol7">Fútbol 7</option>
                  <option value="futbol11">Fútbol 11</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  name="provincia"
                  value={filtros.provincia}
                  onChange={handleFiltroChange}
                  className="input-field text-sm"
                  placeholder="Ej: Buenos Aires"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nivel
                </label>
                <select
                  name="nivel"
                  value={filtros.nivel}
                  onChange={handleFiltroChange}
                  className="input-field text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="soloDisponibles"
                    checked={filtros.soloDisponibles}
                    onChange={handleFiltroChange}
                    className="rounded text-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Solo con cupos
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Ad Slot */}
        <AdSlot size="medium" className="mb-6" />

        {/* Lista de Partidos */}
        {partidosFiltrados.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No hay partidos disponibles
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filtros.busqueda || filtros.provincia 
                ? 'Intenta cambiar los filtros de búsqueda'
                : 'Sé el primero en crear un partido'
              }
            </p>
            <Link to="/app/partidos/crear" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Crear Partido
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partidosFiltrados.map((partido, index) => (
              <div key={partido.id} className="card hover:shadow-2xl transition-all cursor-pointer">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {partido.nombreFormato}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatearFecha(partido.fecha)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{partido.hora}hs</span>
                    </div>
                  </div>
                  
                  {partido.jugadores.length < partido.jugadoresMaximos ? (
                    <span className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      Abierto
                    </span>
                  ) : (
                    <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400">
                      Completo
                    </span>
                  )}
                </div>

                {/* Ubicación */}
                <div className="mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>
                      {partido.nombreCancha 
                        ? `${partido.nombreCancha}, ${partido.barrio}` 
                        : `${partido.barrio}, ${partido.localidad}`
                      }
                    </span>
                  </div>
                  {partido.estadoCancha === 'alquilada' && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-6">
                      📍 Cancha confirmada
                    </div>
                  )}
                </div>

                {/* Progreso de Jugadores */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 inline mr-1" />
                      Jugadores
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {partido.jugadores.length}/{partido.jugadoresMaximos}
                    </span>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(partido.jugadores.length / partido.jugadoresMaximos) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {partido.anfitrionNombre?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Anfitrión</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {partido.anfitrionNombre?.split(' ')[0] || 'Usuario'}
                      </p>
                    </div>
                  </div>

                  {partido.costoPorJugador && (
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Costo</p>
                      <p className="text-sm font-bold text-primary">
                        ${partido.costoPorJugador}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botón Ver Detalles */}
                <Link 
                  to={`/app/partidos/${partido.id}`}
                  className="btn-primary w-full mt-4 text-center"
                >
                  Ver Detalles
                </Link>

                {/* Ad Slot cada 6 items */}
                {(index + 1) % 6 === 0 && index !== partidosFiltrados.length - 1 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <AdSlot size="small" className="my-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
