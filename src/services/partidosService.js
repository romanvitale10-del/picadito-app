import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { enviarMensajeSistema } from './chatService';

// Crear un nuevo partido
export const crearPartido = async (userId, datosPartido) => {
  try {
    console.log('📝 Creando partido en Firestore...');
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
    console.log('✅ Partido creado con ID:', docRef.id);
    
    // Enviar mensaje de bienvenida al chat
    try {
      await enviarMensajeSistema(
        docRef.id,
        `¡Partido creado! ${datosPartido.anfitrionNombre} te da la bienvenida.`
      );
    } catch (chatError) {
      console.warn('⚠️ No se pudo enviar mensaje de bienvenida al chat:', chatError.message);
      // No lanzamos el error para que no falle la creación del partido
    }
    
    return { id: docRef.id, ...partidoData };
  } catch (error) {
    console.error('❌ Error crítico al crear partido:', error);
    throw error;
  }
};

// Obtener partidos cercanos (por ahora todos)
export const obtenerPartidos = async () => {
  try {
    const { getDocs } = await import('firebase/firestore');
    
    console.log('📥 Obteniendo partidos...');
    
    // Obtener todos los partidos y filtrar en el cliente
    // (evita necesitar índices en Firestore)
    const snapshot = await getDocs(collection(db, 'partidos'));
    const partidos = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(p => p.estado === 'abierto'); // Filtrar en el cliente
    
    console.log('✅ Partidos obtenidos:', partidos.length);
    
    // Ordenar por fecha en el cliente
    return partidos.sort((a, b) => {
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;
      return a.fecha.localeCompare(b.fecha);
    });
  } catch (error) {
    console.error('❌ Error al obtener partidos:', error);
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

// Eliminar partido (solo el anfitrión)
export const eliminarPartido = async (partidoId, userId) => {
  try {
    const { doc, getDoc, deleteDoc } = await import('firebase/firestore');
    
    const partidoRef = doc(db, 'partidos', partidoId);
    const partidoSnap = await getDoc(partidoRef);
    
    if (!partidoSnap.exists()) {
      throw new Error('El partido no existe');
    }
    
    const partidoData = partidoSnap.data();
    
    // Verificar que el usuario sea el anfitrión
    if (partidoData.anfitrionId !== userId) {
      throw new Error('Solo el anfitrión puede eliminar el partido');
    }
    
    await deleteDoc(partidoRef);
    console.log('✅ Partido eliminado:', partidoId);
    
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar partido:', error);
    throw error;
  }
};
