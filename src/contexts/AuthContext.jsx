import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Cargar perfil del usuario desde Firestore
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      } else {
        console.log('Perfil no existe, se creará al editar');
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  // Registro con email y password
  const signUp = async (email, password, displayName) => {
    try {
      setAuthLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con nombre
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      // Crear documento inicial en Firestore
      await createUserDocument(userCredential.user.uid, {
        email,
        displayName,
        createdAt: new Date().toISOString()
      });

      // Esperar a que onAuthStateChanged actualice el estado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return userCredential;
    } catch (error) {
      console.error('Error en signUp:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Login con email y password
  const signIn = async (email, password) => {
    try {
      setAuthLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Esperar a que onAuthStateChanged actualice el estado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return userCredential;
    } catch (error) {
      console.error('Error en signIn:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Login con Google
  const signInWithGoogle = async () => {
    try {
      setAuthLoading(true);
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Verificar si el usuario ya existe en Firestore
      const docRef = doc(db, 'usuarios', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // Si es nuevo, crear documento
        await createUserDocument(userCredential.user.uid, {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date().toISOString()
        });
      }

      // Esperar a que onAuthStateChanged actualice el estado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return userCredential;
    } catch (error) {
      console.error('Error en signInWithGoogle:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Crear documento de usuario en Firestore
  const createUserDocument = async (uid, data) => {
    try {
      const userDoc = {
        ...data,
        // Campos iniciales del perfil
        edad: null,
        posicion: null,
        zona: null,
        nivel: 'intermedio',
        partidosJugados: 0,
        partidosConfirmados: 0,
        partidosAsistidos: 0,
        calificacionPromedio: 0,
        totalCalificaciones: 0,
        confianza: 100, // Empieza en 100%
        estrellas: 0,
        teamTheme: 'default',
        notificaciones: true
      };

      await setDoc(doc(db, 'usuarios', uid), userDoc);
      console.log('✅ Documento de usuario creado exitosamente');
      setUserProfile(userDoc);
    } catch (error) {
      console.error('❌ Error al crear documento de usuario:', error);
      throw error;
    }
  };

  // Actualizar perfil de usuario
  const updateUserProfile = async (updates) => {
    if (!user) {
      console.error('❌ No hay usuario autenticado');
      throw new Error('No hay usuario autenticado');
    }

    try {
      console.log('📝 Actualizando perfil con:', updates);
      const docRef = doc(db, 'usuarios', user.uid);
      await setDoc(docRef, updates, { merge: true });
      console.log('✅ Perfil actualizado exitosamente');
      
      // Recargar perfil
      await loadUserProfile(user.uid);
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      console.error('Detalles del error:', error.message);
      throw error;
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const value = {
    user,
    userProfile,
    loading,
    authLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
