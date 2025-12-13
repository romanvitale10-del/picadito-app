import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { postularseAPartido, gestionarPostulante, eliminarPartido } from '../../services/partidosService';
import ChatPartido from '../chat/ChatPartido';
import {
  MapPin, Users, Clock, Calendar, DollarSign, Star,
  Check, X, MessageCircle, Share2, AlertCircle, ChevronLeft, Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DetallePartido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [partido, setPartido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarChat, setMostrarChat] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Suscripción en tiempo real al partido
    const unsubscribe = onSnapshot(
      doc(db, 'partidos', id),
      (docSnap) => {
        if (docSnap.exists()) {
          setPartido({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Partido no encontrado');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error:', error);
        setError('Error al cargar el partido');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  const handlePostularse = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProcesando(true);
    setError('');

    try {
      await postularseAPartido(id, user.uid);
    } catch (err) {
      setError('Error al postularse. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  const handleGestionarPostulante = async (userId, accion) => {
    setProcesando(true);
    try {
      await gestionarPostulante(id, userId, accion);
    } catch (err) {
      setError('Error al gestionar postulante');
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarPartido = async () => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este partido? Esta acción no se puede deshacer.')) {
      return;
    }

    setProcesando(true);
    try {
      await eliminarPartido(id, user.uid);
      navigate('/app/partidos');
    } catch (err) {
      setError(err.message || 'Error al eliminar el partido');
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  const compartirPartido = () => {
    const url = window.location.href;
    const texto = `¡Únete a este partido de ${partido.nombreFormato}! ${url}`;
    
    if (navigator.share) {
      navigator.share({ title: 'Picadito App', text: texto, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado al portapapeles');
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    );
  }

  if (error || !partido) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Partido no encontrado'}
          </h2>
          <Link to="/app/partidos" className="btn-primary inline-block">
            Volver a Partidos
          </Link>
        </div>
      </div>
    );
  }

  const esAnfitrion = user?.uid === partido.anfitrionId;
  const yaPostulado = partido.postulantes?.includes(user?.uid);
  const yaAceptado = partido.jugadoresAceptados?.includes(user?.uid);
  const partidoCompleto = partido.jugadores?.length >= partido.jugadoresMaximos;
  const cuposDisponibles = partido.jugadoresMaximos - (partido.jugadores?.length || 1);

  return (
    <div className="min-h-screen bg-grass-pattern">
      {/* Header con Volver */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container-app py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>

      <main className="container-app py-6 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Título y Acciones */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ⚽ {partido.nombreFormato}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`badge ${
                  partidoCompleto 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                  {partidoCompleto ? 'Completo' : `${cuposDisponibles} ${cuposDisponibles === 1 ? 'cupo' : 'cupos'}`}
                </span>
                <span className="badge bg-primary/10 text-primary capitalize">
                  {partido.nivel}
                </span>
                {partido.tipoPartido === 'privado' && (
                  <span className="badge bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                    Privado
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={compartirPartido}
              className="btn-secondary flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Compartir
            </button>

            {esAnfitrion && (
              <button
                onClick={handleEliminarPartido}
                disabled={procesando}
                className="btn-secondary flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-700"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Información Principal */}
            <div className="md:col-span-2 space-y-6">
              {/* Detalles del Partido */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Detalles del Partido
                </h2>

                <div className="space-y-4">
                  {/* Fecha y Hora */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatearFecha(partido.fecha)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {partido.hora}hs • {partido.duracion} minutos
                      </p>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {partido.nombreCancha || partido.barrio}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {partido.barrio}, {partido.localidad}, {partido.provincia}
                      </p>
                      {partido.direccion && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          📍 {partido.direccion}
                        </p>
                      )}
                      {partido.estadoCancha === 'buscando' && (
                        <span className="inline-block mt-2 text-xs badge bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                          Se definirá cancha exacta
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Costo */}
                  {(partido.costoPorJugador || partido.costoTotal) && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {partido.costoPorJugador 
                            ? `$${partido.costoPorJugador} por jugador`
                            : `$${partido.costoTotal} total`
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Descripción */}
                  {partido.descripcion && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Información Adicional
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                        {partido.descripcion}
                      </p>
                    </div>
                  )}

                  {/* Filtros */}
                  {(partido.edadMin || partido.edadMax || partido.posicionesRequeridas?.length > 0) && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Requisitos
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {partido.edadMin && (
                          <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            Edad mín: {partido.edadMin}
                          </span>
                        )}
                        {partido.edadMax && (
                          <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            Edad máx: {partido.edadMax}
                          </span>
                        )}
                        {partido.posicionesRequeridas?.map((pos) => (
                          <span key={pos} className="badge bg-primary/10 text-primary">
                            {pos}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Jugadores Confirmados */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Jugadores ({partido.jugadores?.length || 1}/{partido.jugadoresMaximos})
                </h2>

                <div className="mb-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ 
                        width: `${((partido.jugadores?.length || 1) / partido.jugadoresMaximos) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                      {partido.anfitrionNombre?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {partido.anfitrionNombre}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        👑 Anfitrión
                      </p>
                    </div>
                  </div>

                  {/* Otros jugadores */}
                  {partido.jugadores?.slice(1).map((jugadorId, index) => (
                    <div key={jugadorId} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                        {index + 2}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Jugador {index + 2}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Cupos vacíos */}
                  {Array.from({ length: cuposDisponibles }).map((_, index) => (
                    <div key={`vacio-${index}`} className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Cupo disponible
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat del Partido */}
              {(yaAceptado || esAnfitrion) && (
                <div className="card p-0 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Chat del Partido
                      </h2>
                      <button
                        onClick={() => setMostrarChat(!mostrarChat)}
                        className="text-sm text-primary hover:underline"
                      >
                        {mostrarChat ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Coordiná con los demás jugadores
                    </p>
                  </div>
                  {mostrarChat && (
                    <div style={{ height: '500px' }}>
                      <ChatPartido 
                        partidoId={id} 
                        jugadores={partido.jugadores || [partido.anfitrionId]}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Postulantes (solo para anfitrión) */}
              {esAnfitrion && partido.postulantes?.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Solicitudes ({partido.postulantes.length})
                  </h2>
                  <div className="space-y-3">
                    {partido.postulantes.map((postulanteId) => (
                      <div key={postulanteId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            ?
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Jugador interesado
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Esperando respuesta
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleGestionarPostulante(postulanteId, 'aceptar')}
                            disabled={procesando || partidoCompleto}
                            className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleGestionarPostulante(postulanteId, 'rechazar')}
                            disabled={procesando}
                            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Anfitrión */}
              <div className="card">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                  Organizado por
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {partido.anfitrionNombre?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {partido.anfitrionNombre}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">Nuevo</span>
                    </div>
                  </div>
                </div>

                {esAnfitrion && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Este es tu partido
                    </p>
                    <button className="btn-secondary w-full flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Chat del Partido
                    </button>
                  </div>
                )}
              </div>

              {/* Acción Principal */}
              {!esAnfitrion && (
                <div className="card">
                  {yaAceptado ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white mb-1">
                        ¡Estás confirmado!
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Nos vemos en la cancha
                      </p>
                      <button className="btn-primary w-full flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Ir al Chat
                      </button>
                    </div>
                  ) : yaPostulado ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white mb-1">
                        Solicitud Enviada
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Esperando respuesta del anfitrión
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handlePostularse}
                        disabled={procesando || partidoCompleto}
                        className="btn-primary w-full mb-3"
                      >
                        {procesando ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="spinner w-5 h-5" />
                            Enviando...
                          </span>
                        ) : partidoCompleto ? (
                          'Partido Completo'
                        ) : (
                          '⚽ Unirme al Partido'
                        )}
                      </button>
                      {partidoCompleto && (
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                          No hay cupos disponibles
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Info Extra */}
              <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                      Recomendación
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Llega 10 minutos antes y trae agua. ¡Que tengas un buen partido!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
