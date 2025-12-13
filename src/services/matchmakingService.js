import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp, arrayUnion, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { enviarMensajeSistema } from './chatService';

/**
 * Unirse a la cola de matchmaking
 */
export const unirseACola = async (userId, preferencias) => {
  try {
    const colaData = {
      userId,
      formato: preferencias.formato || 'futbol5',
      zona: preferencias.zona || '',
      nivel: preferencias.nivel || 'todos',
      rangoFecha: preferencias.rangoFecha || 'semana', // hoy, semana, mes
      timestamp: serverTimestamp(),
      estado: 'buscando' // buscando, emparejado, cancelado
    };

    const docRef = await addDoc(collection(db, 'matchmaking'), colaData);
    return { id: docRef.id, ...colaData };
  } catch (error) {
    console.error('Error al unirse a la cola:', error);
    throw error;
  }
};

/**
 * Salir de la cola de matchmaking
 */
export const salirDeCola = async (colaId) => {
  try {
    await deleteDoc(doc(db, 'matchmaking', colaId));
    return true;
  } catch (error) {
    console.error('Error al salir de la cola:', error);
    throw error;
  }
};

/**
 * Buscar emparejamientos compatibles
 */
export const buscarEmparejamientos = async (userId, preferencias) => {
  try {
    const q = query(
      collection(db, 'matchmaking'),
      where('estado', '==', 'buscando'),
      where('formato', '==', preferencias.formato)
    );

    const snapshot = await getDocs(q);
    const candidatos = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.userId !== userId) {
        candidatos.push({ id: docSnap.id, ...data });
      }
    });

    // Filtrar por zona y nivel si están definidos
    let candidatosFiltrados = candidatos;

    if (preferencias.zona) {
      candidatosFiltrados = candidatosFiltrados.filter(
        c => c.zona === preferencias.zona || c.zona === '' || preferencias.zona === ''
      );
    }

    if (preferencias.nivel && preferencias.nivel !== 'todos') {
      candidatosFiltrados = candidatosFiltrados.filter(
        c => c.nivel === preferencias.nivel || c.nivel === 'todos'
      );
    }

    return candidatosFiltrados;
  } catch (error) {
    console.error('Error al buscar emparejamientos:', error);
    return [];
  }
};

/**
 * Crear partido automático cuando hay suficientes jugadores
 */
export const crearPartidoAutomatico = async (jugadores, formato, zona) => {
  try {
    const formatosInfo = {
      futbol5: { nombre: 'Fútbol 5', jugadores: 10 },
      futbol7: { nombre: 'Fútbol 7', jugadores: 14 },
      futbol11: { nombre: 'Fútbol 11', jugadores: 22 }
    };

    const info = formatosInfo[formato];
    const anfitrion = jugadores[0]; // Primer jugador es el anfitrión

    // Fecha: próximo fin de semana
    const hoy = new Date();
    const diasHastaFinDeSemana = 6 - hoy.getDay(); // Sábado
    const fechaPartido = new Date(hoy);
    fechaPartido.setDate(hoy.getDate() + (diasHastaFinDeSemana > 0 ? diasHastaFinDeSemana : 7));

    const partidoData = {
      nombreFormato: info.nombre,
      formato,
      jugadoresMaximos: info.jugadores,
      jugadores: jugadores.map(j => j.userId),
      jugadoresAceptados: jugadores.map(j => j.userId),
      postulantes: [],
      anfitrionId: anfitrion.userId,
      anfitrionNombre: 'Solo Queue',
      fecha: fechaPartido.toISOString().split('T')[0],
      hora: '18:00',
      duracion: 90,
      estadoCancha: 'buscando',
      provincia: 'Buenos Aires',
      localidad: zona || 'CABA',
      barrio: zona || 'A definir',
      direccion: '',
      nombreCancha: '',
      tipoPartido: 'publico',
      costoTotal: '',
      costoPorJugador: '',
      edadMin: '',
      edadMax: '',
      nivel: 'todos',
      posicionesRequeridas: [],
      descripcion: `Partido creado automáticamente por Solo Queue con ${jugadores.length} jugadores.`,
      esSoloQueue: true,
      estado: 'abierto',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'partidos'), partidoData);

    // Enviar mensaje de bienvenida
    await enviarMensajeSistema(
      docRef.id,
      `🎮 Partido creado por Solo Queue! ${jugadores.length} jugadores emparejados. Coordiná los detalles en este chat.`
    );

    // Marcar jugadores como emparejados y eliminar de la cola
    for (const jugador of jugadores) {
      if (jugador.colaId) {
        await deleteDoc(doc(db, 'matchmaking', jugador.colaId));
      }
    }

    return { id: docRef.id, ...partidoData };
  } catch (error) {
    console.error('Error al crear partido automático:', error);
    throw error;
  }
};

/**
 * Obtener estado de la cola del usuario
 */
export const obtenerEstadoCola = async (userId) => {
  try {
    const q = query(
      collection(db, 'matchmaking'),
      where('userId', '==', userId),
      where('estado', '==', 'buscando')
    );

    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  } catch (error) {
    console.error('Error al obtener estado de cola:', error);
    return null;
  }
};

/**
 * Obtener estadísticas de la cola
 */
export const obtenerEstadisticasCola = async () => {
  try {
    const q = query(
      collection(db, 'matchmaking'),
      where('estado', '==', 'buscando')
    );

    const snapshot = await getDocs(q);
    const stats = {
      total: 0,
      porFormato: {
        futbol5: 0,
        futbol7: 0,
        futbol11: 0
      },
      porNivel: {
        principiante: 0,
        intermedio: 0,
        avanzado: 0,
        todos: 0
      }
    };

    snapshot.forEach(doc => {
      const data = doc.data();
      stats.total++;
      stats.porFormato[data.formato] = (stats.porFormato[data.formato] || 0) + 1;
      stats.porNivel[data.nivel] = (stats.porNivel[data.nivel] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return null;
  }
};
