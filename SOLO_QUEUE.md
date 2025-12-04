# 🎮 Solo Queue - Matchmaking Automático

## Características Implementadas

### ✅ Sistema de Cola (Queue)
- **Unirse a la cola** con preferencias personalizadas
- **Búsqueda automática** de jugadores compatibles cada 5 segundos
- **Salir de la cola** en cualquier momento
- **Persistencia** en Firestore para mantener estado

### ✅ Preferencias de Matchmaking
- **Formato:** Fútbol 5, 7, 11
- **Zona:** Opcional (ej: Palermo, Centro, Belgrano)
- **Nivel:** Principiante, Intermedio, Avanzado, Todos
- **Rango de fecha:** Hoy, Esta semana, Este mes

### ✅ Emparejamiento Inteligente
- **Algoritmo de compatibilidad** por formato, zona y nivel
- **Creación automática de partido** cuando hay suficientes jugadores
- **Asignación de anfitrión** (primer jugador en cola)
- **Limpieza automática** de cola al emparejarse

### ✅ Estadísticas en Tiempo Real
- **Contador total** de jugadores en cola
- **Distribución por formato** (5, 7, 11)
- **Distribución por nivel** (principiante, intermedio, avanzado)
- **Actualización automática** cada vez que alguien se une/sale

### ✅ UX/UI
- **Timer visual** mostrando tiempo en cola
- **Indicador de búsqueda** con animación
- **Resumen de preferencias** mientras se busca
- **CTA destacado** en HomePage con gradiente atractivo

---

## 🔧 Servicios Implementados

### `matchmakingService.js`

**Funciones principales:**

```javascript
// Unirse a la cola
unirseACola(userId, preferencias)
// → Crea registro en Firestore collection 'matchmaking'

// Salir de la cola
salirDeCola(colaId)
// → Elimina registro de Firestore

// Buscar emparejamientos
buscarEmparejamientos(userId, preferencias)
// → Query a Firestore filtrando por formato, zona, nivel

// Crear partido automático
crearPartidoAutomatico(jugadores, formato, zona)
// → Crea partido en Firestore con todos los jugadores
// → Envía mensaje de sistema al chat
// → Limpia cola de todos los participantes

// Obtener estado de cola del usuario
obtenerEstadoCola(userId)
// → Chequea si el usuario está en cola

// Obtener estadísticas
obtenerEstadisticasCola()
// → Retorna conteo total y distribución por formato/nivel
```

---

## 📊 Estructura de Datos

### Registro en Cola (Firestore: `matchmaking`)
```javascript
{
  userId: "uid_del_usuario",
  formato: "futbol5",
  zona: "Palermo",
  nivel: "intermedio",
  rangoFecha: "semana",
  timestamp: ServerTimestamp,
  estado: "buscando" // buscando | emparejado | cancelado
}
```

### Partido Creado Automáticamente
```javascript
{
  // Campos estándar de partido
  nombreFormato: "Fútbol 5",
  jugadores: ["uid1", "uid2", ...], // Array de UIDs
  jugadoresAceptados: ["uid1", "uid2", ...],
  anfitrionId: "uid1",
  anfitrionNombre: "Solo Queue",
  
  // Datos predefinidos
  fecha: "2025-12-07", // Próximo sábado
  hora: "18:00",
  duracion: 90,
  estadoCancha: "buscando",
  tipoPartido: "publico",
  nivel: "todos",
  
  // Flag especial
  esSoloQueue: true,
  
  descripcion: "Partido creado automáticamente por Solo Queue con X jugadores."
}
```

---

## 🎯 Algoritmo de Emparejamiento

### Paso 1: Filtrado Básico
```
1. Buscar jugadores en cola con mismo FORMATO (obligatorio)
2. Excluir al usuario actual
```

### Paso 2: Filtrado Avanzado
```
3. Si zona está definida:
   - Incluir jugadores con misma zona
   - Incluir jugadores sin zona (flexibles)
   
4. Si nivel está definido y != 'todos':
   - Incluir jugadores con mismo nivel
   - Incluir jugadores con nivel='todos' (flexibles)
```

### Paso 3: Creación de Partido
```
5. Contar candidatos compatibles
6. Si candidatos >= (jugadoresNecesarios - 1):
   - Tomar los primeros N jugadores
   - Crear partido automático
   - Notificar vía chat del partido
   - Limpiar cola
   - Redirigir al partido creado
```

### Cantidades Necesarias
- **Fútbol 5:** 10 jugadores
- **Fútbol 7:** 14 jugadores  
- **Fútbol 11:** 22 jugadores

---

## 💡 Flujo de Usuario

### 1. Entrada a Solo Queue
```
Usuario → /solo-queue
  ↓
Configura preferencias (formato, zona, nivel, fecha)
  ↓
Click en "Buscar Partida"
  ↓
Se crea registro en Firestore matchmaking
  ↓
Estado: "Buscando..."
```

### 2. Búsqueda Activa
```
Cada 5 segundos:
  ↓
buscarEmparejamientos()
  ↓
Si hay suficientes jugadores:
  → crearPartidoAutomatico()
  → navigate(/partidos/{id})
  
Si no:
  → Seguir buscando
  → Incrementar timer
```

### 3. Cancelación
```
Usuario → Click "Cancelar Búsqueda"
  ↓
salirDeCola(colaId)
  ↓
Estado: Vuelta a configuración
```

---

## 🚀 Próximas Mejoras

### Algoritmo Inteligente
- [ ] **Puntuación de compatibilidad** (0-100) basada en:
  - Distancia geográfica (si ambos tienen ubicación)
  - Diferencia de nivel de reputación
  - Similitud de edad
  - Horarios preferidos
- [ ] **Priorizar emparejamientos** por score
- [ ] **Machine Learning** para predecir buenos emparejamientos

### UX Mejorada
- [ ] **Notificación push** cuando se encuentra partido
- [ ] **Vista previa** de jugadores antes de confirmar
- [ ] **Chat previo** para coordinación antes del partido
- [ ] **Historial** de partidos creados por Solo Queue

### Funcionalidades Adicionales
- [ ] **Modo "Capitán":** Jugadores pueden liderar creación
- [ ] **Reserva de cancha integrada** vía API
- [ ] **Sistema de invitaciones** para amigos en cola
- [ ] **Partidos recurrentes** (ej: todos los sábados)

### Gamificación
- [ ] **Badge especial** para usuarios frecuentes de Solo Queue
- [ ] **Racha de partidos** completados vía matchmaking
- [ ] **XP bonus** por participar en Solo Queue

---

## 🔔 Integración con Chat

Cuando se crea un partido automático, se envía mensaje de sistema:

```
🎮 Partido creado por Solo Queue! 
X jugadores emparejados. 
Coordiná los detalles en este chat.
```

Esto activa:
- Notificación a todos los jugadores
- Chat disponible inmediatamente
- Coordinación de cancha/horario final

---

## 📱 Páginas Relacionadas

- **`/solo-queue`** - Página principal de matchmaking
- **`/partidos/{id}`** - Partido creado con chat activo
- **`/`** (HomePage) - Banner promocional de Solo Queue

---

## ⚙️ Configuración

### Firestore Collections
```
matchmaking/
  {docId}/
    - userId
    - formato
    - zona
    - nivel
    - rangoFecha
    - timestamp
    - estado

partidos/
  {docId}/
    - esSoloQueue: true (flag especial)
    - ... (resto de campos normales)
```

### Firestore Rules (Recomendadas)
```javascript
match /matchmaking/{docId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null && 
                   request.resource.data.userId == request.auth.uid;
  allow delete: if request.auth != null && 
                   resource.data.userId == request.auth.uid;
}
```

---

**Última actualización:** Sistema Solo Queue completamente funcional ✅
