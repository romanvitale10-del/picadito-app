import Navbar from '../components/common/Navbar';
import AdSlot from '../components/ads/AdSlot';
import { useAuth } from '../contexts/AuthContext';
import { Plus, MapPin, Users, Clock, Star, TrendingUp, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { userProfile } = useAuth();

  // Datos mock para demostración
  const partidosDestacados = [
    {
      id: 1,
      tipo: 'Cancha de 5',
      fecha: 'Hoy, 18:00',
      lugar: 'Polideportivo Norte, Rosario',
      distancia: '2.3 km',
      jugadores: { actual: 8, total: 10 },
      anfitrion: { nombre: 'Carlos M.', confianza: 95, estrellas: 4.5 },
      estado: 'Faltan 2'
    },
    {
      id: 2,
      tipo: 'Cancha de 11',
      fecha: 'Mañana, 20:30',
      lugar: 'Club Atlético, Palermo',
      distancia: '5.1 km',
      jugadores: { actual: 18, total: 22 },
      anfitrion: { nombre: 'Martín R.', confianza: 88, estrellas: 4.2 },
      estado: 'Faltan 4'
    },
    {
      id: 3,
      tipo: 'Cancha de 7',
      fecha: 'Sábado, 10:00',
      lugar: 'Complejo La Cancha, Caballito',
      distancia: '3.7 km',
      jugadores: { actual: 10, total: 14 },
      anfitrion: { nombre: 'Diego P.', confianza: 100, estrellas: 5 },
      estado: 'Faltan 4'
    }
  ];

  const rankingSemanal = [
    { nombre: 'Juan García', partidos: 8, posicion: 1 },
    { nombre: 'Lucas Fernández', partidos: 7, posicion: 2 },
    { nombre: 'Matías Silva', partidos: 6, posicion: 3 }
  ];

  return (
    <>
      <Navbar />
      
      <main className="container-app py-6 pb-24 md:pb-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Hola, {userProfile?.displayName?.split(' ')[0] || 'Futbolero'}! ⚽
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Encuentra partidos cerca tuyo o crea el tuyo propio
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userProfile?.partidosJugados || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Partidos</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userProfile?.estrellas || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Estrellas</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userProfile?.confianza || 100}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Confianza</p>
              </div>
            </div>
          </div>

          <div className="card md:col-span-1 col-span-2">
            <Link to="/app/partidos/crear" className="flex items-center justify-center gap-2 h-full btn-primary">
              <Plus className="w-5 h-5" />
              <span>Crear Partido</span>
            </Link>
          </div>
        </div>

        {/* Ad Slot */}
        <AdSlot size="medium" className="mb-8" />

        {/* Solo Queue CTA */}
        <Link to="/app/solo-queue" className="block mb-8">
          <div className="card bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer border-0">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">¿No encontrás partido?</h3>
                  <p className="text-white/90 text-sm">
                    Probá <strong>Solo Queue</strong> - El sistema te empareja con otros jugadores automáticamente
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="btn-outline border-white text-white hover:bg-white hover:text-purple-600">
                  Probar ahora
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content - Partidos Destacados */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Partidos Cerca Tuyo
              </h2>
              <Link to="/app/partidos" className="text-primary hover:underline text-sm font-medium">
                Ver todos
              </Link>
            </div>

            {partidosDestacados.map((partido) => (
              <div key={partido.id} className="card hover:shadow-2xl transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {partido.tipo}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{partido.fecha}</span>
                    </div>
                  </div>
                  <span className="badge bg-primary text-white">
                    {partido.estado}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>{partido.lugar}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {partido.distancia}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(partido.jugadores.actual / partido.jugadores.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {partido.jugadores.actual}/{partido.jugadores.total}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {partido.anfitrion.nombre.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {partido.anfitrion.nombre}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {partido.anfitrion.estrellas} • {partido.anfitrion.confianza}% confianza
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary text-sm">
                    Unirme
                  </button>
                </div>
              </div>
            ))}

            {/* Ad Slot entre items */}
            <AdSlot size="small" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ranking Semanal */}
            <div className="card">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Top Jugadores
              </h3>
              <div className="space-y-3">
                {rankingSemanal.map((jugador) => (
                  <div key={jugador.posicion} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      jugador.posicion === 1 ? 'bg-yellow-400 text-yellow-900' :
                      jugador.posicion === 2 ? 'bg-gray-300 text-gray-700' :
                      'bg-orange-400 text-orange-900'
                    }`}>
                      {jugador.posicion}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {jugador.nombre}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {jugador.partidos} partidos esta semana
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                Acceso Rápido
              </h3>
              <div className="space-y-2">
                <Link to="/agentes-libres" className="block w-full btn-secondary text-left">
                  <Users className="w-4 h-4 inline mr-2" />
                  Agentes Libres
                </Link>
                <Link to="/app/mapa" className="block w-full btn-secondary text-left">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Ver en Mapa
                </Link>
              </div>
            </div>

            {/* Ad Slot */}
            <AdSlot size="large" />
          </div>
        </div>
      </main>
    </>
  );
}
