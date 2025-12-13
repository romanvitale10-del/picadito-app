# ⚽ Picadito App - Plataforma de Organización de Partidos de Fútbol Amateur

> **PWA completa** para organizar partidos de fútbol amateur en Argentina con sistema de reputación, mapas, chat en tiempo real y matchmaking automático.

---

## 🎯 Características Principales

### ✅ Autenticación & Perfiles
- Login/Registro con email + Google Sign-In
- Sistema de reputación (confianza %, estrellas, partidos jugados)
- Perfiles personalizados (edad, posición, zona preferida)

### ✅ Gestión de Partidos
- Wizard de creación en 3 pasos
- Filtros avanzados (formato, ubicación, nivel, disponibilidad)
- Sistema de postulaciones (aplicar → anfitrión acepta/rechaza)
- Actualización en tiempo real con Firestore

### ✅ Mapas Interactivos 🗺️
- Leaflet + OpenStreetMap
- Geolocalización GPS del usuario
- Cálculo automático de distancias
- Selector de ubicación al crear partido
- Geocoding inverso (coordenadas → dirección)

### ✅ Chat en Tiempo Real 💬
- Firebase Realtime Database
- Chat grupal por partido
- Notificaciones sonoras
- Mensajes del sistema automáticos
- Visible solo para jugadores aceptados

### ✅ Solo Queue (Matchmaking) 🎮
- Emparejamiento automático de jugadores
- Preferencias: formato, zona, nivel, fecha
- Creación automática de partido
- Estadísticas de cola en tiempo real

### ✅ Temas Personalizados 🎨
- Modo oscuro/claro
- 9 temas de equipos argentinos (Boca, River, Racing, etc.)
- CSS variables dinámicas

### ✅ PWA 📱
- Instalable en móvil/desktop
- Offline-first con service workers
- Caché de tiles de mapas

---

## 🛠️ Stack Tecnológico

**Frontend:** React 18.3.1 + Vite 5.1.4 + Tailwind CSS 3.4.1  
**Backend:** Firebase 10.8.0 (Auth, Firestore, Realtime DB, Storage)  
**Mapas:** Leaflet 1.9.4 + react-leaflet 4.2.1  
**PWA:** vite-plugin-pwa 0.19.2

---

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar Firebase (.env)
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto.firebaseio.com

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🛠️ Comandos Disponibles

```bash
npm run dev      # Desarrollo (localhost:3000)
npm run build    # Build de producción
npm run preview  # Preview del build
```

---

## 🗂️ Estructura del Proyecto

```
src/
├── components/     # Componentes React
│   ├── auth/      # Login, Register
│   ├── chat/      # ChatPartido
│   ├── map/       # MapaBase, SelectorUbicacion
│   └── partidos/  # Crear, Detalle
├── contexts/      # AuthContext, ThemeContext
├── hooks/         # useGeolocation, useChatNotifications
├── pages/         # Home, Perfil, Partidos, Mapa, SoloQueue
├── services/      # Firebase, partidos, chat, matchmaking
└── styles/        # Tailwind CSS
```

---

## 🎮 Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | HomePage con feed |
| `/partidos` | Listado de partidos |
| `/partidos/crear` | Crear partido |
| `/partidos/:id` | Detalle + Chat |
| `/mapa` | Mapa interactivo |
| `/solo-queue` | Matchmaking |
| `/perfil` | Perfil de usuario |

---

## 📚 Documentación Adicional

- **[MAPAS.md](./MAPAS.md)** - Sistema de mapas completo
- **[SOLO_QUEUE.md](./SOLO_QUEUE.md)** - Matchmaking automático
- **[CHAT.md](./CHAT.md)** - Sistema de chat (si existe)

---

## 🔐 Firebase Collections

**usuarios/** - Perfiles de usuarios  
**partidos/** - Partidos creados  
**matchmaking/** - Cola de Solo Queue  
**chats/{partidoId}/mensajes/** - Mensajes por partido (Realtime DB)

---

## 🎨 Temas de Equipos

Boca Juniors, River Plate, Racing Club, Independiente, San Lorenzo, Vélez, Estudiantes, Newell's, Rosario Central

---

## 📱 PWA Features

- ✅ Instalable
- ✅ Offline-first
- ✅ Caché de mapas OSM
- ✅ Manifest configurado

---

## 🚀 Próximas Funcionalidades

- [ ] Notificaciones push
- [ ] Valoraciones post-partido
- [ ] Sistema de amigos
- [ ] Torneos
- [ ] Integración con canchas

---

## 📄 Licencia

MIT License - Copyright © 2025 Picadito App

---

**Stack:** React + Vite + Firebase + Tailwind + Leaflet + PWA  
**Firebase Project:** proyect-1-25133
