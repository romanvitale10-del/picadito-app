import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { MapPin, Users, Star, Calendar, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Si el usuario ya está logueado, redirigir a /app
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Navbar Simple Público */}
      <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-md z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">⚽</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Picadito App
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-purple-300 hover:text-white transition-colors px-4 py-2"
              >
                Ingresar
              </button>
              <button
                onClick={() => navigate('/login?register=true')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto Hero */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  ¡Falta Uno!
                </span>
                <br />
                <span className="text-white">
                  La solución definitiva para tu fútbol 5.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Organiza partidos, encontrá jugadores y reservá cancha en segundos. 
                Olvidate de los que te clavan a último momento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/login?register=true')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50 flex items-center justify-center gap-2"
                >
                  Comenzar Gratis
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-bold transition-all border border-white/20"
                >
                  Ya tengo cuenta
                </button>
              </div>
            </div>

            {/* Screenshot Placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/30 shadow-2xl">
                <div className="bg-gray-800/50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 bg-purple-600/30 p-4 rounded-xl">
                    <Calendar className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="h-4 bg-white/30 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-pink-600/30 p-4 rounded-xl">
                    <MapPin className="w-8 h-8 text-pink-400" />
                    <div>
                      <div className="h-4 bg-white/30 rounded w-40 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-purple-600/30 p-4 rounded-xl">
                    <Users className="w-8 h-8 text-purple-400" />
                    <div>
                      <div className="h-4 bg-white/30 rounded w-36 mb-2"></div>
                      <div className="h-3 bg-white/20 rounded w-28"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decoración */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: ¿Por qué usar Picadito App? */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            ¿Por qué usar <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Picadito App</span>?
          </h2>
          <p className="text-center text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
            La plataforma más completa para organizar tu fútbol amateur en Argentina
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all hover:transform hover:scale-105">
              <div className="bg-purple-600/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Armá tu equipo</h3>
              <p className="text-gray-300 leading-relaxed">
                Gestioná convocatorias y listas de espera automáticas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 p-8 rounded-2xl border border-pink-500/30 hover:border-pink-500/60 transition-all hover:transform hover:scale-105">
              <div className="bg-pink-600/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Encontrá rivales</h3>
              <p className="text-gray-300 leading-relaxed">
                ¿Te faltan jugadores? Usá nuestro matchmaking para completar el equipo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 p-8 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all hover:transform hover:scale-105">
              <div className="bg-purple-600/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Reputación</h3>
              <p className="text-gray-300 leading-relaxed">
                Calificá a tus compañeros. Basta de jugar con gente que no corre o llega tarde.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-pink-900/40 to-pink-800/20 p-8 rounded-2xl border border-pink-500/30 hover:border-pink-500/60 transition-all hover:transform hover:scale-105">
              <div className="bg-pink-600/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">100% Gratis</h3>
              <p className="text-gray-300 leading-relaxed">
                La mejor herramienta para el fútbol amateur en Argentina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: Consejos para el Organizador (SEO) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
            Consejos para el <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Organizador</span>
          </h2>
          
          <div className="space-y-8">
            {/* Consejo 1 */}
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-3">
                <span className="bg-purple-600/30 w-10 h-10 rounded-full flex items-center justify-center text-lg">1</span>
                Reglas Básicas del Fútbol 5
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Se juega con <strong className="text-white">5 jugadores por equipo</strong> (1 arquero y 4 de campo). 
                Los cambios son ilimitados y volantes. <strong className="text-white">No hay fuera de juego</strong>. 
                El saque de lateral se hace con el pie (en la mayoría de los torneos amateur) o con la mano según el reglamento local.
              </p>
            </div>

            {/* Consejo 2 */}
            <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 p-8 rounded-2xl border border-pink-500/20 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-pink-400 mb-4 flex items-center gap-3">
                <span className="bg-pink-600/30 w-10 h-10 rounded-full flex items-center justify-center text-lg">2</span>
                Cómo evitar que te falten jugadores
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Lo ideal es convocar siempre a <strong className="text-white">1 o 2 suplentes</strong>. 
                En Picadito App, podés activar la <strong className="text-white">"Lista de Espera"</strong> para que si uno se baja, 
                entre otro automáticamente.
              </p>
            </div>

            {/* Consejo 3 */}
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-3">
                <span className="bg-purple-600/30 w-10 h-10 rounded-full flex items-center justify-center text-lg">3</span>
                El Tercer Tiempo
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                La organización no termina en la cancha. Usá el <strong className="text-white">chat del partido</strong> para 
                coordinar quién lleva las bebidas y dónde se juntan después.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/40 to-pink-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para revolucionar tu fútbol 5?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Unite a cientos de organizadores que ya están usando Picadito App
          </p>
          <button
            onClick={() => navigate('/login?register=true')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-5 rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50 inline-flex items-center gap-3"
          >
            Crear Cuenta Gratis
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-purple-500/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="text-xl">⚽</div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Picadito App
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>© 2025 Picadito App. Todos los derechos reservados.</span>
              <button
                onClick={() => navigate('/privacidad')}
                className="text-purple-400 hover:text-purple-300 transition-colors underline"
              >
                Política de Privacidad
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
