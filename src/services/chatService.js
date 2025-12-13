import { ref, push, onValue, off, set } from 'firebase/database';
import { realtimeDb } from './firebase';

/**
 * Enviar un mensaje al chat de un partido
 */
export const enviarMensaje = async (partidoId, usuarioId, usuarioNombre, mensaje, usuarioFoto = null) => {
  try {
    console.log('📤 Enviando mensaje al chat:', { partidoId, usuarioId });
    const chatRef = ref(realtimeDb, `chats/${partidoId}/mensajes`);
    
    const nuevoMensaje = {
      usuarioId,
      usuarioNombre,
      mensaje: mensaje.trim(),
      timestamp: Date.now(),
      leido: false
    };
    
    if (usuarioFoto) {
      nuevoMensaje.usuarioFoto = usuarioFoto;
    }
    
    await push(chatRef, nuevoMensaje);
    console.log('✅ Mensaje enviado exitosamente');

    return true;
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    throw error;
  }
};

/**
 * Escuchar mensajes en tiempo real
 */
export const escucharMensajes = (partidoId, callback) => {
  console.log('👂 Escuchando mensajes del partido:', partidoId);
  const chatRef = ref(realtimeDb, `chats/${partidoId}/mensajes`);

  const unsubscribe = onValue(chatRef, (snapshot) => {
    console.log('📨 Mensajes recibidos:', snapshot.exists());
    const mensajes = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        mensajes.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Ordenar por timestamp en el cliente
      mensajes.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    }
    
    console.log('💬 Total de mensajes:', mensajes.length);
    callback(mensajes);
  }, (error) => {
    console.error('❌ Error al escuchar mensajes:', error);
    callback([]);
  });

  // Retornar función para desuscribirse
  return () => {
    console.log('🔇 Deteniendo escucha de mensajes');
    off(chatRef);
  };
};

/**
 * Obtener mensajes una sola vez (sin escuchar)
 */
export const obtenerMensajes = async (partidoId) => {
  try {
    const chatRef = ref(realtimeDb, `chats/${partidoId}/mensajes`);

    return new Promise((resolve) => {
      onValue(chatRef, (snapshot) => {
        const mensajes = [];
        
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            mensajes.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          
          // Ordenar por timestamp en el cliente
          mensajes.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        }
        
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
    for (const mensaje of mensajesNoLeidos) {
      const mensajeRef = ref(realtimeDb, `chats/${partidoId}/mensajes/${mensaje.id}/leido`);
      await set(mensajeRef, true);
    }

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
    console.log('🤖 Enviando mensaje del sistema:', partidoId);
    const chatRef = ref(realtimeDb, `chats/${partidoId}/mensajes`);
    
    await push(chatRef, {
      usuarioId: 'sistema',
      usuarioNombre: 'Picadito App',
      mensaje: mensaje.trim(),
      timestamp: Date.now(),
      leido: true,
      esSistema: true
    });

    console.log('✅ Mensaje del sistema enviado');
    return true;
  } catch (error) {
    console.error('❌ Error al enviar mensaje del sistema:', error);
    return false;
  }
};
