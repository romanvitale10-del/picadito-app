import { useState, useEffect } from 'react';
import { escucharMensajes } from '../services/chatService';

/**
 * Hook para gestionar notificaciones de mensajes no leídos
 */
export const useChatNotifications = (partidoId, userId) => {
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);
  const [ultimoMensaje, setUltimoMensaje] = useState(null);

  useEffect(() => {
    if (!partidoId || !userId) return;

    const unsubscribe = escucharMensajes(partidoId, (mensajes) => {
      // Filtrar mensajes que no son del usuario actual
      const mensajesDeOtros = mensajes.filter(m => m.usuarioId !== userId);
      
      if (mensajesDeOtros.length > 0) {
        const ultimo = mensajesDeOtros[mensajesDeOtros.length - 1];
        setUltimoMensaje(ultimo);
        
        // Contar no leídos (simplificado - en producción usar flags de lectura)
        const noLeidos = mensajesDeOtros.filter(m => !m.leido).length;
        setMensajesNoLeidos(noLeidos);
      }
    }, 10); // Solo últimos 10 mensajes para notificaciones

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [partidoId, userId]);

  return { mensajesNoLeidos, ultimoMensaje };
};

/**
 * Hook para reproducir sonido de notificación
 */
export const useNotificationSound = () => {
  const reproducirSonido = () => {
    try {
      // Crear un beep simple usando Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('No se pudo reproducir sonido de notificación');
    }
  };

  return { reproducirSonido };
};

/**
 * Hook para mostrar notificaciones del navegador
 */
export const useBrowserNotification = () => {
  const [permiso, setPermiso] = useState(Notification.permission);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(setPermiso);
    }
  }, []);

  const mostrarNotificacion = (titulo, opciones = {}) => {
    if (permiso === 'granted') {
      new Notification(titulo, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...opciones
      });
    }
  };

  return { mostrarNotificacion, permiso };
};
