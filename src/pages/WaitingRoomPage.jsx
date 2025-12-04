import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import SnakeFutbolero from '../components/games/SnakeFutbolero';
import TriviaFutbol from '../components/games/TriviaFutbol';
import { Gamepad2, Brain } from 'lucide-react';

export default function WaitingRoomPage() {
  const [tabActiva, setTabActiva] = useState('snake');

  return (
    <>
      <Navbar />
      <main className="container-app py-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">
            🎮 Sala de Espera
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ¡Divertite mientras esperás que se arme el partido!
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setTabActiva('snake')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                tabActiva === 'snake'
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Snake Futbolero</span>
            </button>
            
            <button
              onClick={() => setTabActiva('trivia')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${
                tabActiva === 'trivia'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Brain className="w-5 h-5" />
              <span>Trivia de Fútbol</span>
            </button>
          </div>

          {/* Contenido de las tabs */}
          <div className="p-2 md:p-6">
            {tabActiva === 'snake' ? (
              <SnakeFutbolero />
            ) : (
              <TriviaFutbol />
            )}
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-lg p-6 text-white text-center shadow-xl">
          <p className="text-lg font-semibold mb-2">
            💪 ¡Calentá antes del partido!
          </p>
          <p className="text-sm opacity-90">
            Entrenamiento mental mientras esperás. Los mejores jugadores nunca paran de practicar.
          </p>
        </div>
      </main>
    </>
  );
}
