import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Verificar si ya fue instalada
    const wasInstalled = localStorage.getItem('pwa-installed');
    if (wasInstalled) {
      setIsInstalled(true);
      return;
    }

    // Verificar prompt global
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
    }

    // Escuchar evento
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPrompt = e;
    };

    const handleAppInstalled = () => {
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
    if (deferredPrompt) {
      // Si hay prompt disponible, usarlo
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
      }
      setDeferredPrompt(null);
    } else {
      // Si no hay prompt, mostrar instrucciones
      alert('Para instalar:\n\n1. Toca el menú (⋮) arriba\n2. Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"\n\n¡Así podrás acceder más rápido!');
    }
  };

  // Siempre mostrar el botón si NO está instalada
  if (isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-slow"
        aria-label="Instalar aplicación"
      >
        <Download className="w-5 h-5" />
        <span className="font-semibold text-sm">Instalar App</span>
      </button>
    </div>
  );
}
