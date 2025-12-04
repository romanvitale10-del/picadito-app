import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, User, LogOut, Moon, Sun, Palette, Map, Gamepad2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode, currentTeamTheme, changeTeamTheme, availableThemes } = useTheme();
  const location = useLocation();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Header Desktop */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container-app">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-chico-picadito.png.jpg?v=3" alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
              <span className="hidden sm:block text-2xl font-bold text-black" style={{ fontFamily: '"Righteous", cursive' }}>
                Picadito App
              </span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Inicio</span>
              </Link>

              <Link
                to="/partidos"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/partidos')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span>Partidos</span>
              </Link>

              <Link
                to="/mapa"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/mapa')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Map className="w-5 h-5" />
                <span>Mapa</span>
              </Link>

              <Link
                to="/sala-de-espera"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/sala-de-espera')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Juegos</span>
              </Link>

              <Link
                to="/perfil"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/perfil')
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Team Theme Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Tema de Equipo"
                >
                  <Palette className="w-5 h-5" />
                </button>

                {showThemeMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowThemeMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Modo Hincha
                      </div>
                      {Object.entries(availableThemes).map(([key, theme]) => (
                        <button
                          key={key}
                          onClick={() => {
                            changeTeamTheme(key);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            currentTeamTheme === key ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: theme.primary }}
                            />
                            <span className="text-sm">{theme.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive('/')
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Inicio</span>
          </Link>

          <Link
            to="/partidos"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive('/partidos')
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <MapPin className="w-6 h-6" />
            <span className="text-xs">Partidos</span>
          </Link>

          <Link
            to="/mapa"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive('/mapa')
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Map className="w-6 h-6" />
            <span className="text-xs">Mapa</span>
          </Link>

          <Link
            to="/sala-de-espera"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive('/sala-de-espera')
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Gamepad2 className="w-6 h-6" />
            <span className="text-xs">Juegos</span>
          </Link>

          <Link
            to="/perfil"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive('/perfil')
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
