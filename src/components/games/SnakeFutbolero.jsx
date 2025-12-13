import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

export default function SnakeFutbolero() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef(null);
  const lastMoveTimeRef = useRef(0);
  const movementQueueRef = useRef([]);

  // Generar comida aleatoria
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  }, []);

  // Verificar colisión
  const checkCollision = useCallback((head, snakeBody) => {
    // Colisión con paredes
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Colisión con el cuerpo (excluir la última celda que se va a eliminar)
    return snakeBody.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  // Lógica del juego
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    lastMoveTimeRef.current = Date.now();

    // Procesar el siguiente movimiento de la cola si hay alguno
    if (movementQueueRef.current.length > 0) {
      directionRef.current = movementQueueRef.current.shift();
    }

    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + directionRef.current.x,
        y: prevSnake[0].y + directionRef.current.y
      };

      // Verificar colisión con paredes
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Verificar colisión con el cuerpo
      // Solo verificar contra el cuerpo, sin incluir la cabeza ni la cola (que se eliminará)
      const willEat = newHead.x === food.x && newHead.y === food.y;
      
      // Verificar contra todo el cuerpo actual excepto la cola (si no va a comer)
      for (let i = 0; i < prevSnake.length - (willEat ? 0 : 1); i++) {
        if (prevSnake[i].x === newHead.x && prevSnake[i].y === newHead.y) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }
      }

      const newSnake = [newHead, ...prevSnake];

      // Verificar si comió
      if (willEat) {
        setScore(prev => prev + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPaused, food, generateFood]);

  // Game loop
  useEffect(() => {
    if (isPlaying && !gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, isPaused, moveSnake]);

  // Controles de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying || gameOver) return;

      const key = e.key;
      
      // Prevenir scroll de la página con las flechas
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault();
      }

      let newDirection = null;
      const currentDir = movementQueueRef.current.length > 0 
        ? movementQueueRef.current[movementQueueRef.current.length - 1]
        : directionRef.current;

      // Evitar ir en dirección opuesta
      if (key === 'ArrowUp' && currentDir.y === 0) {
        newDirection = { x: 0, y: -1 };
      } else if (key === 'ArrowDown' && currentDir.y === 0) {
        newDirection = { x: 0, y: 1 };
      } else if (key === 'ArrowLeft' && currentDir.x === 0) {
        newDirection = { x: -1, y: 0 };
      } else if (key === 'ArrowRight' && currentDir.x === 0) {
        newDirection = { x: 1, y: 0 };
      }

      // Solo agregar a la cola si es un movimiento válido y no hay muchos en cola
      if (newDirection && movementQueueRef.current.length < 2) {
        movementQueueRef.current.push(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver]);

  // Controles mobile (botones)
  const handleDirectionChange = (newDir) => {
    if (!isPlaying || gameOver) return;

    const currentDir = movementQueueRef.current.length > 0 
      ? movementQueueRef.current[movementQueueRef.current.length - 1]
      : directionRef.current;

    // Verificar que no sea la dirección opuesta
    const isValid = 
      (newDir.y !== 0 && currentDir.y === 0) ||
      (newDir.x !== 0 && currentDir.x === 0);

    if (isValid && movementQueueRef.current.length < 2) {
      movementQueueRef.current.push(newDir);
    }
  };

  const startGame = () => {
    console.log('🎮 Iniciando juego...');
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    movementQueueRef.current = [];
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
    generateFood();
    console.log('✅ Juego iniciado');
  };

  const togglePause = () => {
    if (!gameOver && isPlaying) {
      setIsPaused(prev => !prev);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Marcador */}
      <div className="w-full max-w-md bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Puntaje</p>
            <p className="text-3xl font-bold">{score}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Longitud</p>
            <p className="text-3xl font-bold">{snake.length}</p>
          </div>
        </div>
      </div>

      {/* Canvas del juego */}
      <div className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-2xl p-2">
        <div 
          className="grid gap-0 bg-green-800 rounded"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE
          }}
        >
          {/* Renderizar serpiente */}
          {snake.map((segment, index) => (
            <div
              key={`snake-${index}`}
              className={`${
                index === 0 
                  ? 'bg-yellow-400 border-2 border-yellow-500' 
                  : 'bg-blue-500 border border-blue-600'
              } rounded-sm transition-all duration-75`}
              style={{
                gridColumn: segment.x + 1,
                gridRow: segment.y + 1
              }}
            >
              {index === 0 && (
                <div className="w-full h-full flex items-center justify-center text-[8px]">
                  🧤
                </div>
              )}
            </div>
          ))}

          {/* Renderizar comida (pelota) */}
          <div
            className="bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse"
            style={{
              gridColumn: food.x + 1,
              gridRow: food.y + 1
            }}
          >
            <span className="text-[10px]">⚽</span>
          </div>
        </div>

        {/* Overlay de Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center text-white p-6">
              <h3 className="text-2xl font-bold mb-2">¡Game Over!</h3>
              <p className="text-lg mb-4">Puntaje Final: {score}</p>
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Jugar de Nuevo
              </button>
            </div>
          </div>
        )}

        {/* Overlay de Pausa */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold">PAUSA</h3>
            </div>
          </div>
        )}

        {/* Mensaje inicial */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center text-white p-6">
              <h3 className="text-xl font-bold mb-4">🐍⚽ Snake Futbolero</h3>
              <p className="text-sm mb-4">¡Atrapa las pelotas y crece!</p>
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Comenzar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controles Mobile */}
      <div className="w-full max-w-md">
        {isPlaying && !gameOver && (
          <>
            <button
              onClick={togglePause}
              className="w-full mb-3 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              {isPaused ? 'Reanudar' : 'Pausar'}
            </button>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-start-2">
                <button
                  onClick={() => handleDirectionChange({ x: 0, y: -1 })}
                  className="w-full aspect-square bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-lg transition-colors"
                  disabled={!isPlaying || gameOver}
                >
                  <ChevronUp className="w-8 h-8" />
                </button>
              </div>
              
              <div className="col-start-1 row-start-2">
                <button
                  onClick={() => handleDirectionChange({ x: -1, y: 0 })}
                  className="w-full aspect-square bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-lg transition-colors"
                  disabled={!isPlaying || gameOver}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              </div>
              
              <div className="col-start-2 row-start-2">
                <button
                  onClick={() => handleDirectionChange({ x: 0, y: 1 })}
                  className="w-full aspect-square bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-lg transition-colors"
                  disabled={!isPlaying || gameOver}
                >
                  <ChevronDown className="w-8 h-8" />
                </button>
              </div>
              
              <div className="col-start-3 row-start-2">
                <button
                  onClick={() => handleDirectionChange({ x: 1, y: 0 })}
                  className="w-full aspect-square bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-lg transition-colors"
                  disabled={!isPlaying || gameOver}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Instrucciones */}
      <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm">
        <h4 className="font-semibold mb-2">Instrucciones:</h4>
        <ul className="space-y-1 text-gray-700 dark:text-gray-300">
          <li>🧤 El arquero (amarillo) atrapa pelotas ⚽</li>
          <li>💙 Cada pelota suma 10 puntos</li>
          <li>🎮 Desktop: Usa las flechas del teclado</li>
          <li>📱 Mobile: Usa los botones en pantalla</li>
          <li>❌ ¡No choques con las paredes ni contigo mismo!</li>
        </ul>
      </div>
    </div>
  );
}
