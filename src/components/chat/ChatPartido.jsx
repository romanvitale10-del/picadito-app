import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Users, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { enviarMensaje, escucharMensajes } from '../../services/chatService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ChatPartido({ partidoId, jugadores = [] }) {
  const { user, currentUser } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const mensajesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mensajesPreviosRef = useRef(0);
  const primeraVezRef = useRef(true);

  const reproducirSonido = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('No se pudo reproducir sonido');
    }
  }, []);

  useEffect(() => {
    if (!partidoId) {
      console.log('⚠️ No hay partidoId');
      setCargando(false);
      return;
    }

    console.log('🔄 Iniciando suscripción al chat:', partidoId);
    setCargando(true);
    
    // Escuchar mensajes en tiempo real
    const unsubscribe = escucharMensajes(partidoId, (nuevosMensajes) => {
      console.log('📬 Mensajes actualizados:', nuevosMensajes.length);
      setMensajes(nuevosMensajes);
      setCargando(false);
      
      // Reproducir sonido si hay nuevos mensajes de otros usuarios
      if (mensajesPreviosRef.current > 0 && nuevosMensajes.length > mensajesPreviosRef.current) {
        const ultimoMensaje = nuevosMensajes[nuevosMensajes.length - 1];
        if (ultimoMensaje.usuarioId !== user?.uid && !ultimoMensaje.esSistema) {
          reproducirSonido();
        }
      }
      mensajesPreviosRef.current = nuevosMensajes.length;
      
      // Auto-scroll al último mensaje SOLO si hay mensajes nuevos (no al cargar por primera vez)
      if (!primeraVezRef.current && nuevosMensajes.length > 0) {
        setTimeout(() => {
          mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      
      // Marcar que ya pasó la primera carga
      if (primeraVezRef.current) {
        primeraVezRef.current = false;
      }
    });

    return () => {
      console.log('🛑 Limpiando suscripción del chat');
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [partidoId, user?.uid, reproducirSonido]);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    
    if (!nuevoMensaje.trim() || enviando) return;

    setEnviando(true);
    
    try {
      console.log('📤 Enviando mensaje...');
      await enviarMensaje(
        partidoId,
        user?.uid,
        currentUser?.nombre || user?.displayName || 'Usuario',
        nuevoMensaje,
        currentUser?.fotoURL || user?.photoURL
      );
      
      console.log('✅ Mensaje enviado');
      setNuevoMensaje('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      alert('No se pudo enviar el mensaje. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const formatearFecha = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const fecha = new Date(timestamp);
      const ahora = new Date();
      const diferencia = ahora - fecha;
      
      // Menos de 1 minuto
      if (diferencia < 60000) {
        return 'Ahora';
      }
      
      // Menos de 1 hora
      if (diferencia < 3600000) {
        const minutos = Math.floor(diferencia / 60000);
        return `Hace ${minutos} min`;
      }
      
      // Hoy
      if (fecha.toDateString() === ahora.toDateString()) {
        return format(fecha, 'HH:mm', { locale: es });
      }
      
      // Esta semana
      if (diferencia < 7 * 24 * 60 * 60 * 1000) {
        return format(fecha, "EEE HH:mm", { locale: es });
      }
      
      // Más antiguo
      return format(fecha, "dd/MM HH:mm", { locale: es });
    } catch (error) {
      return '';
    }
  };

  const obtenerIniciales = (nombre) => {
    if (!nombre) return '?';
    const palabras = nombre.split(' ');
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  if (cargando) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Chat del Partido</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col h-full">
        {/* Header del chat */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold">Chat del Partido</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {jugadores.length} {jugadores.length === 1 ? 'participante' : 'participantes'}
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
        {mensajes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No hay mensajes todavía
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              ¡Sé el primero en enviar un mensaje!
            </p>
          </div>
        ) : (
          mensajes.map((mensaje) => {
            const esMio = mensaje.usuarioId === user?.uid;
            const esSistema = mensaje.esSistema || mensaje.usuarioId === 'sistema';

            if (esSistema) {
              return (
                <div key={mensaje.id} className="flex justify-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full">
                    {mensaje.mensaje}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={mensaje.id}
                className={`flex gap-2 ${esMio ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {mensaje.usuarioFoto ? (
                    <img
                      src={mensaje.usuarioFoto}
                      alt={mensaje.usuarioNombre}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                      {obtenerIniciales(mensaje.usuarioNombre)}
                    </div>
                  )}
                </div>

                {/* Mensaje */}
                <div className={`flex-1 max-w-[70%] ${esMio ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!esMio && (
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 px-1">
                      {mensaje.usuarioNombre}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      esMio
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">{mensaje.mensaje}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 px-1">
                    {formatearFecha(mensaje.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={mensajesEndRef} />
      </div>

      {/* Input de mensaje */}
      <form onSubmit={handleEnviarMensaje} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribí un mensaje..."
            className="flex-1 input-field"
            disabled={enviando}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!nuevoMensaje.trim() || enviando}
            className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {enviando ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          {nuevoMensaje.length}/500 caracteres
        </p>
      </form>
      </div>
    </div>
  );
}
