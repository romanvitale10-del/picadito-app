import Navbar from '../components/common/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Star, Trophy, TrendingUp, MapPin, User, Mail, Calendar, Award } from 'lucide-react';
import { useState } from 'react';

export default function PerfilPage() {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    edad: userProfile?.edad || '',
    posicion: userProfile?.posicion || '',
    zona: userProfile?.zona || ''
  });

  const posiciones = [
    'Arquero',
    'Defensor',
    'Mediocampista',
    'Delantero',
    'Volante'
  ];

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage({ type: '', text: '' });
    
    try {
      console.log('🔄 Intentando guardar:', formData);
      await updateUserProfile(formData);
      
      setSaveMessage({ type: 'success', text: '✅ Perfil guardado exitosamente!' });
      setIsEditing(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
      setSaveMessage({ 
        type: 'error', 
        text: `❌ Error: ${error.message || 'No se pudo guardar. Revisa la consola.'}` 
      });
    } finally {
      setSaving(false);
    }
  };

  const confianza = userProfile?.confianza || 100;
  const estrellas = userProfile?.estrellas || 0;
  const partidosJugados = userProfile?.partidosJugados || 0;

  return (
    <>
      <Navbar />
      
      <main className="container-app py-6 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Header del Perfil */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={userProfile?.displayName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                    {userProfile?.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
              </div>

              {/* Info Principal */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {userProfile?.displayName || 'Usuario'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <div className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {confianza}% Confianza
                  </div>
                  <div className="badge bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                    <Star className="w-3 h-3 mr-1" />
                    {estrellas.toFixed(1)} Estrellas
                  </div>
                  <div className="badge bg-primary/10 text-primary">
                    <Trophy className="w-3 h-3 mr-1" />
                    {partidosJugados} Partidos
                  </div>
                </div>
              </div>

              {/* Botón Editar */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? 'btn-secondary' : 'btn-primary'}
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Estadísticas */}
            <div className="md:col-span-2 space-y-6">
              {/* Formulario de Edición */}
              {isEditing && (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Editar Información
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Edad
                      </label>
                      <input
                        type="number"
                        value={formData.edad}
                        onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                        className="input-field"
                        placeholder="Ej: 25"
                        min="16"
                        max="80"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Posición Preferida
                      </label>
                      <select
                        value={formData.posicion}
                        onChange={(e) => setFormData({ ...formData, posicion: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Selecciona una posición</option>
                        {posiciones.map((pos) => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Zona de Residencia
                      </label>
                      <input
                        type="text"
                        value={formData.zona}
                        onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                        className="input-field"
                        placeholder="Ej: Palermo, CABA"
                      />
                    </div>

                    {saveMessage.text && (
                      <div className={`p-3 rounded-lg mb-4 ${
                        saveMessage.type === 'success' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {saveMessage.text}
                      </div>
                    )}

                    <button 
                      onClick={handleSave} 
                      disabled={saving}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                    </button>
                  </div>
                </div>
              )}

              {/* Datos del Perfil */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Información Personal
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Edad</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {userProfile?.edad || 'No especificada'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Posición</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {userProfile?.posicion || 'No especificada'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Zona</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {userProfile?.zona || 'No especificada'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historial de Partidos */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Historial Reciente
                </h2>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aún no has jugado ningún partido</p>
                  <p className="text-sm mt-1">¡Únete a uno para empezar tu historial!</p>
                </div>
              </div>
            </div>

            {/* Sidebar - Sistema de Reputación */}
            <div className="space-y-6">
              {/* Confianza */}
              <div className="card">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Nivel de Confianza
                </h3>
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - confianza / 100)}`}
                        className="text-green-600 transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {confianza}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userProfile?.partidosAsistidos || 0} de {userProfile?.partidosConfirmados || 0} confirmados
                  </p>
                </div>
              </div>

              {/* Calificación */}
              <div className="card">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Calificación
                </h3>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= estrellas
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {estrellas.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userProfile?.totalCalificaciones || 0} calificaciones
                  </p>
                </div>
              </div>

              {/* Logros */}
              <div className="card">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Logros
                </h3>
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Juega más partidos para desbloquear logros</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
