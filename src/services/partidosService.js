import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { enviarMensajeSistema } from './chatService';

// Crear un nuevo partido
export const crearPartido = async (userId, datosPartido) => {
  try {
    const partidoData = {
      ...datosPartido,
      anfitrionId: userId,
      jugadores: [userId], // El anfitrión ya está en la lista
      jugadoresAceptados: [userId],
      postulantes: [],
      listaEspera: [],
      estado: 'abierto', // abierto, cerrado, finalizado, cancelado
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'partidos'), partidoData);
    
    // Enviar mensaje de bienvenida al chat
    await enviarMensajeSistema(
      docRef.id,
      `⚽ Partido creado! Bienvenidos a este ${datosPartido.nombreFormato}`
    );

    return { id: docRef.id, ...partidoData };
  } catch (error) {
    console.error('Error al crear partido:', error);
    throw error;
  }
};

// Obtener partidos cercanos (por ahora todos)
export const obtenerPartidos = async () => {
  try {
    const { getDocs, query, where, orderBy } = await import('firebase/firestore');
    
    const q = query(
      collection(db, 'partidos'),
      where('estado', '==', 'abierto'),
      orderBy('fecha', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener partidos:', error);
    throw error;
  }
};

// Postularse a un partido
export const postularseAPartido = async (partidoId, userId) => {
  try {
    const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');
    
    const partidoRef = doc(db, 'partidos', partidoId);
    await updateDoc(partidoRef, {
      postulantes: arrayUnion(userId),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error al postularse:', error);
    throw error;
  }
};

// Aceptar/Rechazar postulante
export const gestionarPostulante = async (partidoId, userId, accion, nombreUsuario = 'Un jugador') => {
  try {
    const { doc, updateDoc, arrayUnion, arrayRemove, getDoc } = await import('firebase/firestore');
    
    const partidoRef = doc(db, 'partidos', partidoId);
    
    if (accion === 'aceptar') {
      await updateDoc(partidoRef, {
        jugadoresAceptados: arrayUnion(userId),
        jugadores: arrayUnion(userId),
        postulantes: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });

      // Enviar mensaje automático al chat
      await enviarMensajeSistema(
        partidoId,
        `🎉 ${nombreUsuario} se unió al partido`
      );
    } else {
      await updateDoc(partidoRef, {
        postulantes: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error al gestionar postulante:', error);
    throw error;
  }
};
