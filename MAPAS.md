# 🗺️ Sistema de Mapas - Picadito App

## Características Implementadas

### ✅ Mapa Interactivo
- **Visualización de partidos** en OpenStreetMap con Leaflet
- **Marcadores personalizados** con íconos de fútbol
- **Popups informativos** con detalles de cada partido
- **Clustering automático** de partidos cercanos

### ✅ Geolocalización
- **Ubicación del usuario** con GPS del dispositivo
- **Botón "Mi Ubicación"** para centrar el mapa
- **Marcador azul** diferenciado para el usuario
- **Permisos del navegador** manejados correctamente

### ✅ Filtros de Búsqueda
- **Por formato:** Fútbol 5, 7, 11
- **Por distancia:** Slider de 1-100km desde tu ubicación
- **Por fecha:** Hoy, Esta semana, Todas
- **Contador** de partidos encontrados

### ✅ Selector de Ubicación (Crear Partido)
- **Modal interactivo** con mapa completo
- **Click para colocar marcador** en cualquier punto
- **Marcador arrastrable** para ajustar posición
- **Geocoding inverso automático** (lat/lng → dirección)
- **Autocompletado** de campos (barrio, localidad, provincia)
- **Botón de ubicación actual** integrado

### ✅ Cálculo de Distancias
- **Fórmula de Haversine** para distancias precisas
- **Ordenamiento** por proximidad al usuario
- **Formato legible:** metros (<1km) o kilómetros

---

## 🎮 Cómo Usar

### Ver Partidos en el Mapa

1. **Navegar a `/mapa`** desde el menú principal
2. **Hacer click en "Mi Ubicación"** para centrar el mapa (necesita permisos)
3. **Hacer click en cualquier marcador** para ver detalles del partido
4. **Usar filtros** para refinar la búsqueda:
   - Seleccionar formato de partido
   - Ajustar distancia máxima (requiere ubicación activa)
   - Filtrar por fecha

### Crear Partido con Ubicación

1. **Ir a "Crear Partido"** (`/partidos/crear`)
2. **Paso 2: Ubicación**
   - Seleccionar "Ya Alquilada" o "Buscando Gente"
   - Completar provincia, localidad, barrio manualmente
   - **Hacer click en "Seleccionar ubicación en el mapa"**
3. **En el modal del mapa:**
   - Click en "Mi Ubicación" (recomendado) O
   - Click en cualquier punto del mapa O
   - Arrastrar el marcador
4. **Confirmar ubicación** → Se autocompletan los campos

---

## 🔧 Componentes Técnicos

### `MapaBase.jsx`
Componente base del mapa reutilizable:
```jsx
<MapaBase
  center={[-34.6037, -58.3816]} // [lat, lng]
  zoom={13}
  partidos={partidosArray}
  userLocation={[lat, lng]}
  onPartidoClick={(partido) => navigate(`/partidos/${partido.id}`)}
/>
```

### `SelectorUbicacion.jsx`
Selector interactivo para crear partidos:
```jsx
<SelectorUbicacion
  ubicacionInicial={[lat, lng]} // Opcional
  onUbicacionSeleccionada={(ubicacion) => {
    // ubicacion = { lat, lng, barrio, localidad, provincia, direccion }
  }}
/>
```

### `useGeolocation.js`
Hook personalizado para geolocalización:
```jsx
const { location, loading, error, obtenerUbicacion } = useGeolocation();
// location = { lat, lng, accuracy }
```

**Utilidades adicionales:**
- `calcularDistancia(lat1, lon1, lat2, lon2)` → "1.2km" o "450m"
- `obtenerDireccion(lat, lng)` → Geocoding inverso (OpenStreetMap Nominatim)
- `obtenerCoordenadas(direccion)` → Geocoding directo

---

## 📊 Estructura de Datos

### Partido con Ubicación
```javascript
{
  // ... campos existentes del partido
  
  // Nuevos campos de ubicación
  lat: -34.603722,
  lng: -58.381592,
  barrio: "Palermo",
  localidad: "CABA",
  provincia: "Buenos Aires",
  direccion: "Av. del Libertador 1234" // Opcional
}
```

---

## 🌐 APIs Externas

### OpenStreetMap Nominatim
- **Geocoding directo:** `https://nominatim.openstreetmap.org/search?q={direccion}`
- **Geocoding inverso:** `https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lng}`
- **Rate Limit:** 1 request/segundo (ya implementado)
- **GRATIS y sin API Key**

### Leaflet Tiles
- **Proveedor:** OpenStreetMap
- **URL:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Caché:** Configurado en `vite.config.js` (PWA)

---

## 🎨 Personalización

### Íconos de Marcadores

**Partidos:**
```html
<div style="
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
">⚽</div>
```

**Usuario:**
```html
<div style="
  background-color: #3b82f6;
  width: 16px;
  height: 16px;
  border-radius: 50%;
">
```

### Estilos del Mapa

Los estilos del mapa se adaptan automáticamente al tema activo (claro/oscuro) gracias a las CSS variables de Tailwind:

```css
/* Cambiar color de marcadores según tema del equipo */
background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
```

---

## 🚀 Próximas Mejoras

- [ ] **Rutas y navegación** con Google Maps / Waze
- [ ] **Clustering avanzado** con `leaflet.markercluster`
- [ ] **Heatmap** de actividad de partidos
- [ ] **Filtro por radio circular** visual en el mapa
- [ ] **Búsqueda de dirección** con autocompletado
- [ ] **Modo satélite** (requiere tile provider adicional)
- [ ] **Compartir ubicación** del partido por WhatsApp/Telegram

---

## 📱 Compatibilidad

✅ **Desktop:** Chrome, Firefox, Edge, Safari  
✅ **Mobile:** Chrome (Android), Safari (iOS)  
✅ **PWA:** Totalmente funcional offline con tiles cacheadas  
✅ **Geolocalización:** Requiere HTTPS (o localhost)

---

## 🐛 Troubleshooting

### El mapa no se muestra
- Verificar que Leaflet CSS esté importado: `import 'leaflet/dist/leaflet.css'`
- Revisar consola del navegador para errores

### Los marcadores no aparecen
- Confirmar que los partidos tengan campos `lat` y `lng`
- Verificar que las coordenadas sean válidas (números entre -90/90 y -180/180)

### Geolocalización no funciona
- Verificar que el sitio esté en HTTPS (o localhost)
- Revisar permisos del navegador (Settings → Privacy → Location)
- Probar en otro navegador

### Geocoding muy lento
- Nominatim tiene rate limit de 1 req/seg
- Para producción, considerar servicio pago (Mapbox, Google Maps)

---

**Última actualización:** Implementación completa del sistema de mapas ✅
