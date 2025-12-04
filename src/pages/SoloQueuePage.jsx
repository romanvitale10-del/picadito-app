import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Users, MapPin, Loader, Zap, Clock, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  unirseACola,
  salirDeCola,
  buscarEmparejamientos,
  crearPartidoAutomatico,
  obtenerEstadoCola,
  obtenerEstadisticasCola
} from '../services/matchmakingService';

export default function SoloQueuePage() {
  const { user, currentUser } = useAuth();
  const navigate = useNavigate();
  const [enCola, setEnCola] = useState(false);
  const [colaId, setColaId] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [tiempoBuscando, setTiempoBuscando] = useState(0);
  const [stats, setStats] = useState(null);
  const [preferencias, setPreferencias] = useState({
    formato: 'futbol5',
    zona: currentUser?.zona || '',
    nivel: currentUser?.nivel || 'todos',
    rangoFecha: 'semana'
  });

  useEffect(() => {
    cargarEstado();
    cargarEstadisticas();
  }, []);

  useEffect(() => {
    let intervalo;
    if (enCola) {
      intervalo = setInterval(() => {
        setTiempoBuscando(prev => prev + 1);
        buscarPartida();
      }, 5000); // Buscar cada 5 segundos
    }
    return () => clearInterval(intervalo);
  }, [enCola, preferencias]);

  const cargarEstado = async () => {
    const estado = await obtenerEstadoCola(user.uid);
    if (estado) {
      setEnCola(true);
      setColaId(estado.id);
      setPreferencias({
        formato: estado.formato,
        zona: estado.zona,
        nivel: estado.nivel,
        rangoFecha: estado.rangoFecha
      });
    }
  };

  const cargarEstadisticas = async () => {
    const estadisticas = await obtenerEstadisticasCola();
    setStats(estadisticas);
  };

  const buscarPartida = async () => {
    try {
      const candidatos = await buscarEmparejamientos(user.uid, preferencias);
      
      // Determinar cuántos jugadores se necesitan
      const jugadoresNecesarios = {
        futbol5: 10,
        futbol7: 14,
        futbol11: 22
      }[preferencias.formato];

      // Si hay suficientes candidatos, crear partido
      if (candidatos.length >= jugadoresNecesarios - 1) {
        const jugadores = [
          { userId: user.uid, colaId },
          ...candidatos.slice(0, jugadoresNecesarios - 1)
        ];

        const partido = await crearPartidoAutomatico(
          jugadores,
          preferencias.formato,
          preferencias.zona
        );

        // Salir de la cola
        if (colaId) await salirDeCola(colaId);
        setEnCola(false);
        setColaId(null);

        // Ir al partido creado
        navigate(`/partidos/${partido.id}`);
      }
    } catch (error) {
      console.error('Error al buscar partida:', error);
    }
  };

  const handleUnirse = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBuscando(true);
    try {
      const resultado = await unirseACola(user.uid, preferencias);
      setColaId(resultado.id);
      setEnCola(true);
      setTiempoBuscando(0);
      await cargarEstadisticas();
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo unir a la cola. Inténtalo de nuevo.');
    } finally {
      setBuscando(false);
    }
  };

  const handleSalir = async () => {
    if (colaId) {
      await salirDeCola(colaId);
    }
    setEnCola(false);
    setColaId(null);
    setTiempoBuscando(0);
    await cargarEstadisticas();
  };

  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-grass-pattern py-6 pb-24 md:pb-6">
      <div className="container-app max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Solo Queue</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Buscá partida automáticamente. El sistema te emparejará con otros jugadores según tus preferencias.
          </p>
        </div>

        {!enCola ? (
          <>
            {/* Formulario de Preferencias */}
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Configurá tus Preferencias
              </h2>

              <div className="space-y-4">
                {/* Formato */}
                <div>
                  <label className="block text-sm font-medium mb-2">Formato</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['futbol5', 'futbol7', 'futbol11'].map(formato => (
                      <button
                        key={formato}
                        onClick={() => setPreferencias({ ...preferencias, formato })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          preferencias.formato === formato
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <p className="font-semibold capitalize">{formato.replace('futbol', 'Fútbol ')}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {formato === 'futbol5' ? '10 jugadores' : formato === 'futbol7' ? '14 jugadores' : '22 jugadores'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zona */}
                <div>
                  <label className="block text-sm font-medium mb-2">Zona (Opcional)</label>
                  <input
                    type="text"
                    value={preferencias.zona}
                    onChange={(e) => setPreferencias({ ...preferencias, zona: e.target.value })}
                    className="input-field w-full"
                    placeholder="Ej: Palermo, Belgrano, Centro"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Dejá vacío para buscar en cualquier zona
                  </p>
                </div>

                {/* Nivel */}
                <div>
                  <label className="block text-sm font-medium mb-2">Nivel</label>
                  <select
                    value={preferencias.nivel}
                    onChange={(e) => setPreferencias({ ...preferencias, nivel: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="todos">Todos los niveles</option>
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </div>

                {/* Rango de Fecha */}
                <div>
                  <label className="block text-sm font-medium mb-2">Cuándo querés jugar</label>
                  <select
                    value={preferencias.rangoFecha}
                    onChange={(e) => setPreferencias({ ...preferencias, rangoFecha: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="hoy">Hoy</option>
                    <option value="semana">Esta semana</option>
                    <option value="mes">Este mes</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleUnirse}
                disabled={buscando}
                className="btn-primary w-full mt-6 py-3 text-lg"
              >
                {buscando ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Uniéndose...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Gamepad2 className="w-5 h-5" />
                    Buscar Partida
                  </span>
                )}
              </button>
            </div>

            {/* Estadísticas */}
            {stats && (
              <div className="card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Jugadores en Cola: {stats.total}
                </h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-bold text-lg">{stats.porFormato.futbol5}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Fútbol 5</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-bold text-lg">{stats.porFormato.futbol7}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Fútbol 7</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-bold text-lg">{stats.porFormato.futbol11}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Fútbol 11</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Estado: Buscando Partida */
          <div className="card text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-4 animate-pulse">
                <Loader className="w-10 h-10 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Buscando Partida...</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Estamos buscando jugadores compatibles con tus preferencias
              </p>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-mono">{formatTiempo(tiempoBuscando)}</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Tus Preferencias:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="capitalize">{preferencias.formato.replace('futbol', 'Fútbol ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{preferencias.zona || 'Cualquier zona'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="capitalize">{preferencias.nivel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="capitalize">{preferencias.rangoFecha}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSalir}
              className="btn-secondary w-full"
            >
              Cancelar Búsqueda
            </button>
          </div>
        )}

        {/* Info Card */}
        <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mt-6">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-300">
            ¿Cómo funciona Solo Queue?
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Configurás tus preferencias de formato, zona, nivel y fecha</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>El sistema busca otros jugadores con preferencias similares</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Cuando hay suficientes jugadores, se crea un partido automáticamente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Coordiná los detalles finales (cancha, horario) en el chat del partido</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
