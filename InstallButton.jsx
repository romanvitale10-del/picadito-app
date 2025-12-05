import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Verificar si ya fue rechazada/instalada anteriormente
    const wasInstalled = localStorage.getItem('pwa-installed');
    const wasDismissed = localStorage.getItem('pwa-dismissed');
    
    if (wasInstalled || wasDismissed) {
      return;
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevenir que el navegador muestre su propio prompt
      e.preventDefault();
      // Guardar el evento para usarlo después
      setDeferredPrompt(e);
      // Mostrar el botón
      setShowButton(true);
    };

    // Escuchar cuando la app fue instalada
    const handleAppInstalled = () => {
      setShowButton(false);
      setIsInstalled(true);
      localStorage.setItem('pwa-installed', 'true');
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt nativo
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la PWA');
      localStorage.setItem('pwa-installed', 'true');
    } else {
      console.log('Usuario rechazó instalar la PWA');
    }

    // Limpiar el prompt
    setDeferredPrompt(null);
    setShowButton(false);
  };

  const handleDismiss = () => {
    setShowButton(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  // No mostrar si está instalada o si no hay prompt disponible
  if (isInstalled || !showButton) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-bounce-slow">
      {/* Botón principal */}
      <div className="relative group">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg shadow-xl whitespace-nowrap">
            ¡Instalá la app en tu celular! 📱
            <div className="absolute top-full right-6 -mt-1">
              <div className="border-8 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          </div>
        </div>

        {/* Botón de cerrar */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all duration-200 hover:scale-110 z-10"
          aria-label="Cerrar"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Botón principal */}
        <button
          onClick={handleInstallClick}
          className="relative flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Instalar aplicación"
        >
          {/* Efecto de brillo animado */}
          <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse"></div>
          
          {/* Icono */}
          <div className="relative">
            <Download className="w-6 h-6 animate-bounce" />
          </div>

          {/* Texto (solo visible en desktop) */}
          <span className="hidden md:block font-semibold relative">
            Instalar App
          </span>

          {/* Badge de "Nuevo" */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
            ¡Nuevo!
          </span>
        </button>
      </div>
    </div>
  );
}
