import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { crearPartido } from '../../services/partidosService';
import SelectorUbicacion from '../map/SelectorUbicacion';
import { 
  MapPin, Users, Calendar, Clock, DollarSign, 
  Lock, Globe, AlertCircle, ChevronRight 
} from 'lucide-react';

export default function CrearPartidoForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paso, setPaso] = useState(1); // Wizard de 3 pasos

  const [formData, setFormData] = useState({
    // Paso 1: Básico
    formato: 'futbol5',
    fecha: '',
    hora: '',
    duracion: 90,
    
    // Paso 2: Ubicación
    estadoCancha: 'buscando', // 'alquilada' o 'buscando'
    provincia: '',
    localidad: '',
    barrio: '',
    direccion: '',
    nombreCancha: '',
    lat: null,
    lng: null,
    
    // Paso 3: Configuración
    tipoPartido: 'publico', // 'publico' o 'privado'
    costoTotal: '',
    costoPorJugador: '',
    edadMin: '',
    edadMax: '',
    nivel: 'intermedio',
    posicionesRequeridas: [],
    descripcion: ''
  });

  const formatosDisponibles = [
    { id: 'futbol5', nombre: 'Fútbol 5', jugadores: 10 },
    { id: 'futbol7', nombre: 'Fútbol 7', jugadores: 14 },
    { id: 'futbol11', nombre: 'Fútbol 11', jugadores: 22 }
  ];

  const niveles = ['principiante', 'intermedio', 'avanzado', 'todos'];
  
  const posiciones = ['Arquero', 'Defensor', 'Mediocampista', 'Delantero'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          posicionesRequeridas: [...formData.posicionesRequeridas, value]
        });
      } else {
        setFormData({
          ...formData,
          posicionesRequeridas: formData.posicionesRequeridas.filter(p => p !== value)
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Solo procesar si estamos en el paso 3 y no está cargando
    if (paso !== 3 || loading) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formatoSeleccionado = formatosDisponibles.find(f => f.id === formData.formato);
      
      const partidoData = {
        ...formData,
        jugadoresMaximos: formatoSeleccionado.jugadores,
        nombreFormato: formatoSeleccionado.nombre,
        anfitrionNombre: user.displayName || 'Usuario',
        anfitrionEmail: user.email
      };

      await crearPartido(user.uid, partidoData);
      navigate('/app/partidos');
    } catch (err) {
      setError('Error al crear el partido. Inténtalo de nuevo.');
      console.error(err);
      setLoading(false);
    }
  };

  const siguientePaso = () => {
    // Validar paso 1
    if (paso === 1) {
      if (!formData.fecha || !formData.hora) {
        setError('Por favor completa la fecha y hora del partido');
        return;
      }
    }
    
    // Validar paso 2
    if (paso === 2) {
      if (!formData.provincia || !formData.localidad || !formData.barrio) {
        setError('Por favor completa la ubicación del partido');
        return;
      }
      if (formData.estadoCancha === 'alquilada' && (!formData.nombreCancha || !formData.direccion)) {
        setError('Por favor completa el nombre y dirección de la cancha');
        return;
      }
    }
    
    setError('');
    if (paso < 3) setPaso(paso + 1);
  };

  const pasoAnterior = () => {
    if (paso > 1) setPaso(paso - 1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                paso >= num 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  paso > num ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Básico</span>
          <span>Ubicación</span>
          <span>Detalles</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="card">
          {/* PASO 1: Información Básica */}
          {paso === 1 && (
            <div className="space-y-6 fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Información Básica
              </h2>

              {/* Formato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Formato del Partido
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {formatosDisponibles.map((formato) => (
                    <label
                      key={formato.id}
                      className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                        formData.formato === formato.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="formato"
                        value={formato.id}
                        checked={formData.formato === formato.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="font-bold text-gray-900 dark:text-white">{formato.nombre}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formato.jugadores} jugadores
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fecha y Hora */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Hora
                  </label>
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Duración */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duración (minutos)
                </label>
                <select
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value={60}>60 minutos</option>
                  <option value={90}>90 minutos</option>
                  <option value={120}>120 minutos</option>
                </select>
              </div>
            </div>
          )}

          {/* PASO 2: Ubicación */}
          {paso === 2 && (
            <div className="space-y-6 fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ubicación del Partido
              </h2>

              {/* Estado de la Cancha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Estado de la Cancha
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                      formData.estadoCancha === 'alquilada'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="estadoCancha"
                      value="alquilada"
                      checked={formData.estadoCancha === 'alquilada'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Ya Alquilada</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Lugar exacto confirmado</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                      formData.estadoCancha === 'buscando'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="estadoCancha"
                      value="buscando"
                      checked={formData.estadoCancha === 'buscando'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Buscando Gente</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Zona aproximada</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Ubicación */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Provincia
                  </label>
                  <input
                    type="text"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ej: Buenos Aires"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Localidad
                  </label>
                  <input
                    type="text"
                    name="localidad"
                    value={formData.localidad}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ej: CABA, Rosario"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Barrio
                </label>
                <input
                  type="text"
                  name="barrio"
                  value={formData.barrio}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ej: Palermo, Centro"
                  required
                />
              </div>

              {formData.estadoCancha === 'alquilada' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre de la Cancha
                    </label>
                    <input
                      type="text"
                      name="nombreCancha"
                      value={formData.nombreCancha}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Ej: Polideportivo Norte"
                      required={formData.estadoCancha === 'alquilada'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dirección Exacta
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Ej: Av. Corrientes 1234"
                      required={formData.estadoCancha === 'alquilada'}
                    />
                  </div>
                </>
              )}

              {/* Selector de Ubicación en el Mapa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ubicación en el Mapa {formData.estadoCancha === 'alquilada' ? '(Requerida)' : '(Opcional)'}
                </label>
                <SelectorUbicacion
                  ubicacionInicial={formData.lat && formData.lng ? [formData.lat, formData.lng] : null}
                  onUbicacionSeleccionada={(ubicacion) => {
                    if (ubicacion) {
                      setFormData({
                        ...formData,
                        lat: ubicacion.lat,
                        lng: ubicacion.lng,
                        // Autocompletar datos si están vacíos
                        barrio: formData.barrio || ubicacion.barrio,
                        localidad: formData.localidad || ubicacion.localidad,
                        provincia: formData.provincia || ubicacion.provincia,
                      });
                    } else {
                      setFormData({
                        ...formData,
                        lat: null,
                        lng: null,
                      });
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* PASO 3: Detalles */}
          {paso === 3 && (
            <div className="space-y-6 fade-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Detalles Finales
              </h2>

              {/* Tipo de Partido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tipo de Partido
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                      formData.tipoPartido === 'publico'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoPartido"
                      value="publico"
                      checked={formData.tipoPartido === 'publico'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <Globe className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Público</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Visible en el feed</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                      formData.tipoPartido === 'privado'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoPartido"
                      value="privado"
                      checked={formData.tipoPartido === 'privado'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <Lock className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Privado</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Solo con link</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Costos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Costo Total (opcional)
                  </label>
                  <input
                    type="number"
                    name="costoTotal"
                    value={formData.costoTotal}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="$0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Costo por Jugador (opcional)
                  </label>
                  <input
                    type="number"
                    name="costoPorJugador"
                    value={formData.costoPorJugador}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="$0"
                    min="0"
                  />
                </div>
              </div>

              {/* Filtros de Admisión */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Filtros de Admisión
                </label>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Edad Mínima
                    </label>
                    <input
                      type="number"
                      name="edadMin"
                      value={formData.edadMin}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="16"
                      min="16"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Edad Máxima
                    </label>
                    <input
                      type="number"
                      name="edadMax"
                      value={formData.edadMax}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="80"
                      max="80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Nivel
                    </label>
                    <select
                      name="nivel"
                      value={formData.nivel}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {niveles.map((nivel) => (
                        <option key={nivel} value={nivel}>
                          {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Posiciones Requeridas (opcional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {posiciones.map((pos) => (
                      <label
                        key={pos}
                        className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <input
                          type="checkbox"
                          value={pos}
                          checked={formData.posicionesRequeridas.includes(pos)}
                          onChange={handleChange}
                          className="rounded text-primary"
                        />
                        <span className="text-sm">{pos}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción / Comentarios
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="input-field"
                  rows="4"
                  placeholder="Agrega cualquier detalle adicional..."
                />
              </div>
            </div>
          )}

          {/* Botones de Navegación */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {paso > 1 && (
              <button
                type="button"
                onClick={pasoAnterior}
                className="btn-secondary flex-1"
              >
                Anterior
              </button>
            )}

            {paso < 3 ? (
              <button
                type="button"
                onClick={siguientePaso}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="spinner w-5 h-5" />
                    Creando...
                  </span>
                ) : (
                  '⚽ Crear Partido'
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
