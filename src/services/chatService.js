import { ref, push, onValue, off, serverTimestamp, query, orderByChild, limitToLast } from 'firebase/database';
import { realtimeDb } from './firebase';

/**
 * Enviar un mensaje al chat de un partido
 */
export const enviarMensaje = async (partidoId, usuarioId, usuarioNombre, mensaje, usuarioFoto = null) => {
  try {
    const chatRef = ref(realtimeDb, `chats/${partidoId}/mensajes`);
    
    await push(chatRef, {
      usuarioId,
      usuarioNombre,
      usuarioFoto,
      mensaje: mensaje.trim(),
      timestamp: serverTimestamp(),
      leido: false
    });

    // Actualizar última actividad del chat
    const metadataRef = ref(realtimeDb, `chats/${partidoId}/metadata`);
    await push(metadataRef, {
      ultimoMensaje: mensaje.trim().substring(0, 100),
      ultimoUsuario: usuarioNombre,
      ultimaActividad: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    throw error;
  }
};

/**
 * Escuchar mensajes en tiempo real
 */
export const escucharMensajes = (partidoId, callback, limite = 50) => {
  const chatRef = ref(realtimeDb, `chats/${partidoId}/mensajes`);
  const mensajesQuery = query(chatRef, orderByChild('timestamp'), limitToLast(limite));

  onValue(mensajesQuery, (snapshot) => {
    const mensajes = [];
    snapshot.forEach((childSnapshot) => {
      mensajes.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(mensajes);
  });

  // Retornar función para desuscribirse
  return () => off(mensajesQuery);
};

/**
 * Obtener mensajes una sola vez (sin escuchar)
 */
export const obtenerMensajes = async (partidoId, limite = 50) => {
  try {
    const chatRef = ref(realtimeDb, `chats/${partidoId}/mensajes`);
    const mensajesQuery = query(chatRef, orderByChild('timestamp'), limitToLast(limite));

    return new Promise((resolve) => {
      onValue(mensajesQuery, (snapshot) => {
        const mensajes = [];
        snapshot.forEach((childSnapshot) => {
          mensajes.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        resolve(mensajes);
      }, { onlyOnce: true });
    });
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return [];
  }
};

/**
 * Marcar mensajes como leídos
 */
export const marcarMensajesComoLeidos = async (partidoId, usuarioId) => {
  try {
    const mensajes = await obtenerMensajes(partidoId);
    const mensajesNoLeidos = mensajes.filter(m => m.usuarioId !== usuarioId && !m.leido);

    // Actualizar estado de lectura
    // (Implementación simplificada - en producción usar batch updates)
    mensajesNoLeidos.forEach(mensaje => {
      const mensajeRef = ref(realtimeDb, `chats/${partidoId}/mensajes/${mensaje.id}/leido`);
      push(mensajeRef, true);
    });

    return true;
  } catch (error) {
    console.error('Error al marcar mensajes como leídos:', error);
    return false;
  }
};

/**
 * Obtener cantidad de mensajes no leídos
 */
export const obtenerMensajesNoLeidos = async (partidoId, usuarioId) => {
  try {
    const mensajes = await obtenerMensajes(partidoId);
    return mensajes.filter(m => m.usuarioId !== usuarioId && !m.leido).length;
  } catch (error) {
    console.error('Error al obtener mensajes no leídos:', error);
    return 0;
  }
};

/**
 * Enviar mensaje del sistema (notificaciones automáticas)
 */
export const enviarMensajeSistema = async (partidoId, mensaje) => {
  try {
    const chatRef = ref(realtimeDb, `chats/${partidoId}/mensajes`);
    
    await push(chatRef, {
      usuarioId: 'sistema',
      usuarioNombre: 'Picadito App',
      usuarioFoto: null,
      mensaje: mensaje.trim(),
      timestamp: serverTimestamp(),
      leido: true,
      esSistema: true
    });

    return true;
  } catch (error) {
    console.error('Error al enviar mensaje del sistema:', error);
    return false;
  }
};
