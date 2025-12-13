import { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';

const PREGUNTAS = [
  {
    id: 1,
    pregunta: "¿Quién es considerado el máximo ídolo de Boca Juniors?",
    opciones: ["Diego Maradona", "Juan Román Riquelme", "Martín Palermo", "Carlos Tevez"],
    respuestaCorrecta: 0
  },
  {
    id: 2,
    pregunta: "¿En qué año ganó Argentina su tercera Copa del Mundo?",
    opciones: ["2014", "2018", "2022", "2010"],
    respuestaCorrecta: 2
  },
  {
    id: 3,
    pregunta: "¿Cuántas Copas Libertadores tiene River Plate?",
    opciones: ["3", "4", "5", "6"],
    respuestaCorrecta: 1
  },
  {
    id: 4,
    pregunta: "¿Qué jugador argentino ganó más Balones de Oro?",
    opciones: ["Diego Maradona", "Alfredo Di Stéfano", "Lionel Messi", "Gabriel Batistuta"],
    respuestaCorrecta: 2
  },
  {
    id: 5,
    pregunta: "¿En qué estadio se juega el Superclásico argentino?",
    opciones: ["Estadio Monumental", "La Bombonera", "Ambos estadios alternadamente", "Estadio Único de La Plata"],
    respuestaCorrecta: 2
  }
];

// Ranking mockup
const RANKING_MOCKUP = [
  { posicion: 1, nombre: "Messi10", puntos: 450, avatar: "👑" },
  { posicion: 2, nombre: "DiegoEterno", puntos: 420, avatar: "⚽" },
  { posicion: 3, nombre: "Riquelme5", puntos: 380, avatar: "🎯" },
  { posicion: 4, nombre: "BatiGol", puntos: 350, avatar: "💪" },
  { posicion: 5, nombre: "ElPibe", puntos: 320, avatar: "🔥" },
  { posicion: 6, nombre: "Kun_Aguero", puntos: 300, avatar: "⭐" },
  { posicion: 7, nombre: "AngelDi", puntos: 280, avatar: "🦅" },
  { posicion: 8, nombre: "Lautaro22", puntos: 250, avatar: "🐂" },
  { posicion: 9, nombre: "Dibu_23", puntos: 220, avatar: "🧤" },
  { posicion: 10, nombre: "Enzo_River", puntos: 200, avatar: "💎" }
];

export default function TriviaFutbol() {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [yaJugoHoy, setYaJugoHoy] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState('');
  const timerRef = useRef(null);
  const tiempoInicioPreguntaRef = useRef(Date.now());

  const pregunta = PREGUNTAS[preguntaActual];
  const puntaje = respuestas.reduce((total, r) => total + r.puntos, 0);

  // Verificar si ya jugó hoy
  useEffect(() => {
    const ultimoJuego = localStorage.getItem('triviaUltimoJuego');
    const hoy = new Date().toDateString();
    
    if (ultimoJuego === hoy) {
      setYaJugoHoy(true);
      calcularTiempoRestante();
    }
  }, []);

  // Calcular tiempo restante hasta mañana
  const calcularTiempoRestante = () => {
    const ahora = new Date();
    const manana = new Date(ahora);
    manana.setDate(manana.getDate() + 1);
    manana.setHours(0, 0, 0, 0);
    
    const diff = manana - ahora;
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    setTiempoRestante(`${horas}h ${minutos}m`);
  };

  // Timer para la pregunta actual
  useEffect(() => {
    if (!juegoTerminado && respuestaSeleccionada === null) {
      tiempoInicioPreguntaRef.current = Date.now();
      setTiempoTranscurrido(0);
      
      timerRef.current = setInterval(() => {
        setTiempoTranscurrido(Math.floor((Date.now() - tiempoInicioPreguntaRef.current) / 1000));
      }, 100);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [preguntaActual, juegoTerminado, respuestaSeleccionada]);

  // Calcular puntos según el tiempo (máximo 100 puntos, mínimo 10)
  const calcularPuntos = (tiempoEnSegundos) => {
    const TIEMPO_MAXIMO = 30; // 30 segundos para responder
    const PUNTOS_MAXIMOS = 100;
    const PUNTOS_MINIMOS = 10;
    
    // Si responde en menos de 3 segundos: 100 puntos
    if (tiempoEnSegundos <= 3) return PUNTOS_MAXIMOS;
    
    // Reducir puntos proporcionalmente hasta el tiempo máximo
    const puntos = PUNTOS_MAXIMOS - ((tiempoEnSegundos - 3) / (TIEMPO_MAXIMO - 3)) * (PUNTOS_MAXIMOS - PUNTOS_MINIMOS);
    
    return Math.max(PUNTOS_MINIMOS, Math.floor(puntos));
  };

  const handleRespuesta = (indice) => {
    if (respuestaSeleccionada !== null) return;

    const correcta = indice === pregunta.respuestaCorrecta;
    const tiempoRespuesta = Math.floor((Date.now() - tiempoInicioPreguntaRef.current) / 1000);
    const puntos = correcta ? calcularPuntos(tiempoRespuesta) : 0;
    
    setRespuestaSeleccionada(indice);
    setMostrarResultado(true);

    // Detener el timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeout(() => {
      setRespuestas([...respuestas, { correcta, puntos, tiempo: tiempoRespuesta }]);
      
      if (preguntaActual < PREGUNTAS.length - 1) {
        setPreguntaActual(preguntaActual + 1);
        setRespuestaSeleccionada(null);
        setMostrarResultado(false);
      } else {
        setJuegoTerminado(true);
        // Marcar que ya jugó hoy
        const hoy = new Date().toDateString();
        localStorage.setItem('triviaUltimoJuego', hoy);
        setYaJugoHoy(true);
      }
    }, 1500);
  };

  const reiniciarJuego = () => {
    setPreguntaActual(0);
    setRespuestas([]);
    setMostrarResultado(false);
    setRespuestaSeleccionada(null);
    setJuegoTerminado(false);
    setTiempoTranscurrido(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const getButtonColor = (indice) => {
    if (respuestaSeleccionada === null) {
      return 'bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600';
    }
    
    if (indice === pregunta.respuestaCorrecta) {
      return 'bg-green-500 text-white border-2 border-green-600';
    }
    
    if (indice === respuestaSeleccionada && indice !== pregunta.respuestaCorrecta) {
      return 'bg-red-500 text-white border-2 border-red-600';
    }
    
    return 'bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 opacity-50';
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 p-4">
      {/* Panel de Trivia */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          {yaJugoHoy && !juegoTerminado ? (
            // Mensaje de que ya jugó hoy
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
                ¡Ya jugaste hoy! 🎮
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Podés volver a jugar en:
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                {tiempoRestante}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                La trivia se renueva cada día a las 00:00
              </p>
            </div>
          ) : !juegoTerminado ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    🧠 Cuánto sabés de Fútbol
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pregunta {preguntaActual + 1} de {PREGUNTAS.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Puntaje</p>
                  <p className="text-3xl font-bold text-green-600">{puntaje}</p>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {tiempoTranscurrido}s
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  • Más rápido = Más puntos
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((preguntaActual + 1) / PREGUNTAS.length) * 100}%` }}
                />
              </div>

              {/* Pregunta */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 mb-6">
                <p className="text-xl font-semibold">{pregunta.pregunta}</p>
              </div>

              {/* Opciones */}
              <div className="space-y-3">
                {pregunta.opciones.map((opcion, indice) => (
                  <button
                    key={indice}
                    onClick={() => handleRespuesta(indice)}
                    disabled={respuestaSeleccionada !== null}
                    className={`w-full text-left p-4 rounded-lg font-medium transition-all transform hover:scale-[1.02] ${getButtonColor(indice)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opcion}</span>
                      {mostrarResultado && indice === pregunta.respuestaCorrecta && (
                        <CheckCircle className="w-6 h-6 text-white" />
                      )}
                      {mostrarResultado && indice === respuestaSeleccionada && indice !== pregunta.respuestaCorrecta && (
                        <XCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {mostrarResultado && (
                <div className={`mt-4 p-4 rounded-lg ${
                  respuestaSeleccionada === pregunta.respuestaCorrecta
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  <p className="font-semibold">
                    {respuestaSeleccionada === pregunta.respuestaCorrecta
                      ? `¡Correcto! 🎉 +${respuestas[respuestas.length - 1]?.puntos || 0} puntos`
                      : '¡Incorrecto! ❌ +0 puntos'}
                  </p>
                </div>
              )}
            </>
          ) : (
            // Pantalla de resultados
            <div className="text-center py-8">
              <Trophy className="w-24 h-24 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                ¡Juego Terminado!
              </h3>
              <p className="text-xl mb-6 text-gray-600 dark:text-gray-400">
                Puntaje Final: <span className="font-bold text-green-600">{puntaje}</span> / 500
              </p>
              
              <div className="mb-6">
                <p className="text-lg mb-2">Respuestas correctas: {respuestas.filter(r => r.correcta).length} / {PREGUNTAS.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tiempo promedio: {(respuestas.reduce((sum, r) => sum + r.tiempo, 0) / respuestas.length).toFixed(1)}s por pregunta
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(respuestas.filter(r => r.correcta).length / PREGUNTAS.length) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={reiniciarJuego}
                disabled={yaJugoHoy}
                className={`${yaJugoHoy ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors`}
                title={yaJugoHoy ? `Podrás jugar de nuevo en ${tiempoRestante}` : ''}
              >
                <RotateCcw className="w-5 h-5" />
                Jugar de Nuevo{yaJugoHoy ? ' (Mañana)' : ''}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ranking Semanal */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sticky top-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Top 10 Semanal
            </h3>
          </div>
          
          <div className="space-y-2">
            {RANKING_MOCKUP.map((jugador) => (
              <div
                key={jugador.posicion}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  jugador.posicion <= 3
                    ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20'
                    : 'bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  jugador.posicion === 1 ? 'bg-yellow-500 text-white' :
                  jugador.posicion === 2 ? 'bg-gray-400 text-white' :
                  jugador.posicion === 3 ? 'bg-orange-600 text-white' :
                  'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}>
                  {jugador.posicion}
                </div>
                
                <span className="text-2xl">{jugador.avatar}</span>
                
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {jugador.nombre}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {jugador.puntos} pts
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-center text-blue-700 dark:text-blue-300">
              🏆 El ranking se actualiza cada lunes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
