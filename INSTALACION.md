# 📋 GUÍA DE INSTALACIÓN - PICADITO APP

## ✅ FASE 1 COMPLETADA

### 📁 Estructura de Carpetas Creada

```
picadito-app/
├── public/                    # Archivos estáticos y PWA
├── src/
│   ├── assets/               # Imágenes, logos, iconos
│   ├── components/           # Componentes React
│   │   ├── auth/            # Componentes de autenticación
│   │   ├── common/          # Componentes reutilizables
│   │   ├── partidos/        # Componentes de partidos
│   │   ├── chat/            # Sistema de chat
│   │   ├── profile/         # Perfil de usuario
│   │   ├── map/             # Mapa y geolocalización
│   │   └── ads/             # Espacios publicitarios
│   ├── contexts/            # Contexts API (Theme, Auth)
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Páginas principales
│   ├── services/            # Servicios (Firebase, APIs)
│   ├── styles/              # Estilos globales
│   └── utils/               # Funciones auxiliares
├── .env.example             # Plantilla de variables
├── package.json             # Dependencias
├── vite.config.js           # Configuración Vite + PWA
├── tailwind.config.js       # Configuración Tailwind
└── index.html               # Punto de entrada
```

## 🚀 PASOS DE INSTALACIÓN

### 1️⃣ Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
cd "c:\Users\Usuario\Downloads\mi web\picadito-app"
npm install
```

### 2️⃣ Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado "picadito-app"
3. Activa los siguientes servicios:
   - **Authentication** → Habilita Email/Password y Google
   - **Firestore Database** → Crea en modo producción
   - **Realtime Database** → Para chat en tiempo real
   - **Storage** → Para fotos de perfil
4. Ve a **Configuración del Proyecto** → **Tus apps** → **Agregar app web**
5. Copia las credenciales de Firebase

### 3️⃣ Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   Copy-Item .env.example .env
   ```

2. Abre `.env` y reemplaza con tus credenciales de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
   ```

### 4️⃣ Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 📦 Dependencias Instaladas

### Producción:
- **react** ^18.3.1 - Framework principal
- **react-dom** ^18.3.1 - Renderizado React
- **react-router-dom** ^6.22.0 - Enrutamiento
- **firebase** ^10.8.0 - Backend completo
- **leaflet** ^1.9.4 - Mapas interactivos
- **react-leaflet** ^4.2.1 - Integración Leaflet + React
- **date-fns** ^3.3.1 - Manejo de fechas
- **lucide-react** ^0.344.0 - Iconos modernos

### Desarrollo:
- **vite** ^5.1.4 - Build tool ultrarrápido
- **@vitejs/plugin-react** ^4.2.1 - Soporte React
- **tailwindcss** ^3.4.1 - Framework CSS
- **vite-plugin-pwa** ^0.19.2 - Soporte PWA
- **eslint** ^8.57.0 - Linter JavaScript

## 🎨 Sistema de Temas Configurado

### Modo Claro/Oscuro
Toggle automático con persistencia en localStorage.

### Temas de Equipos ("Modo Hincha")
- Por Defecto (Verde)
- Boca Juniors / Rosario Central (Azul y Oro)
- River Plate / Estudiantes (Rojo y Blanco)
- Independiente (Rojo)
- Racing Club (Celeste y Blanco)
- San Lorenzo (Azul y Rojo)
- Vélez Sarsfield (Azul y Blanco)
- Newell's Old Boys (Rojo y Negro)

## 🔧 Archivos Clave Configurados

### ✅ `src/services/firebase.js`
Inicialización de Firebase con todos los servicios (Auth, Firestore, Storage, Realtime DB).

### ✅ `src/contexts/ThemeContext.jsx`
Manejo del tema claro/oscuro y paletas de equipos con variables CSS.

### ✅ `src/contexts/AuthContext.jsx`
Sistema de autenticación completo con:
- Registro Email/Password
- Login Email/Password
- Login con Google
- Gestión de perfiles en Firestore
- Sistema de confianza y calificación

### ✅ `src/main.jsx`
Punto de entrada con:
- ThemeProvider
- AuthProvider
- BrowserRouter
- Registro de Service Worker para PWA

### ✅ `vite.config.js`
- Configuración PWA
- Caché de mapas OpenStreetMap
- Manifest para instalación móvil

### ✅ `tailwind.config.js`
- Temas personalizados
- Colores de equipos
- Fondos con textura de pasto
- Modo oscuro

## 🎯 Próximos Pasos

**Fase 2** - Componentes de Autenticación:
- Pantalla de Login/Registro
- Formularios de autenticación
- Protección de rutas

**Fase 3** - Perfil de Usuario:
- Componente de perfil
- Sistema de reputación
- Edición de datos

**Fase 4** - Sistema de Partidos:
- Creación de partidos
- Lista de partidos
- Sistema de postulación

**Fase 5** - Mapa y Geolocalización:
- Integración Leaflet
- Búsqueda por ubicación
- Filtros geográficos

**Fase 6** - Chat y Social:
- Chat en tiempo real
- Sistema de invitaciones
- Notificaciones

## 🆘 Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Firebase no conecta
Verifica que las variables en `.env` sean correctas y que el archivo exista.

### Error: Tailwind no aplica estilos
Asegúrate de que `index.css` esté importado en `main.jsx`.

---

**Estado Actual:** ✅ Fase 1 Completada
**Siguiente Paso:** Instalar dependencias con `npm install`
