import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Cookie, UserX } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al inicio</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="text-xl">⚽</div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Picadito App
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-2xl mb-6">
            <Shield className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Política de Privacidad
          </h1>
          <p className="text-xl text-gray-400">
            Última actualización: Diciembre 2025
          </p>
        </div>

        {/* Introducción */}
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-sm mb-8">
          <p className="text-gray-300 text-lg leading-relaxed">
            En <strong className="text-white">Picadito App</strong>, nos tomamos muy en serio tu privacidad. 
            Esta política describe cómo recopilamos y usamos tu información.
          </p>
        </div>

        {/* Sección 1: Información que recopilamos */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600/30 w-12 h-12 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              1. Información que recopilamos
            </h2>
          </div>

          <div className="space-y-6 ml-0 md:ml-15">
            {/* Datos de Registro */}
            <div className="bg-black/30 p-6 rounded-xl border border-purple-500/10">
              <h3 className="text-xl font-semibold text-purple-400 mb-3">
                📧 Datos de Registro
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Cuando te registras con <strong className="text-white">Google o Email</strong>, 
                guardamos tu dirección de correo y nombre para identificar tu perfil.
              </p>
            </div>

            {/* Ubicación */}
            <div className="bg-black/30 p-6 rounded-xl border border-purple-500/10">
              <h3 className="text-xl font-semibold text-pink-400 mb-3">
                📍 Ubicación
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Solicitamos acceso a tu ubicación (GPS) únicamente para mostrarte 
                <strong className="text-white"> partidos y canchas cercanas a tu zona</strong>. 
                No compartimos tu ubicación exacta en tiempo real con terceros.
              </p>
            </div>

            {/* Cookies */}
            <div className="bg-black/30 p-6 rounded-xl border border-purple-500/10">
              <h3 className="text-xl font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                Cookies
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Utilizamos cookies para mantener tu sesión iniciada y para mostrar 
                <strong className="text-white"> publicidad relevante a través de Google AdSense</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Sección 2: Uso de la información */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-600/30 w-12 h-12 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              2. Uso de la información
            </h2>
          </div>

          <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 p-8 rounded-2xl border border-pink-500/20 backdrop-blur-sm">
            <ul className="space-y-4 text-gray-300 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-pink-400 text-2xl">•</span>
                <span>Para facilitar la <strong className="text-white">organización de partidos</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-2xl">•</span>
                <span>Para mejorar nuestros <strong className="text-white">servicios y seguridad</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400 text-2xl">•</span>
                <span>Para mostrar <strong className="text-white">contenido publicitario financiado</strong>.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sección 3: Tus derechos */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600/30 w-12 h-12 rounded-xl flex items-center justify-center">
              <UserX className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              3. Tus derechos
            </h2>
          </div>

          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
            <p className="text-gray-300 text-lg leading-relaxed">
              Podés solicitar la <strong className="text-white">eliminación de tu cuenta y todos tus datos</strong> en 
              cualquier momento desde la sección <strong className="text-purple-400">'Perfil'</strong>.
            </p>
          </div>
        </div>

        {/* Footer de la Política */}
        <div className="text-center pt-8 border-t border-purple-500/20">
          <p className="text-gray-400 mb-6">
            Si tenés dudas sobre esta política, podés contactarnos a través de la app.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            Volver al inicio
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-purple-500/20 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="text-lg">⚽</div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Picadito App
            </span>
          </div>
          <p className="text-sm text-gray-400">
            © 2025 Picadito App. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
