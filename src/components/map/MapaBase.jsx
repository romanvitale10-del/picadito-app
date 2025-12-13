import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los íconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapaBase({ 
  center = [-34.6037, -58.3816], // Buenos Aires por defecto
  zoom = 13,
  partidos = [],
  onPartidoClick,
  userLocation,
  className = ''
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Inicializar el mapa
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Agregar capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      // Limpiar el mapa al desmontar
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Actualizar centro del mapa cuando cambia
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  useEffect(() => {
    // Agregar marcador de ubicación del usuario
    if (mapInstanceRef.current && userLocation) {
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      L.marker(userLocation, { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Tu ubicación</b>')
        .openPopup();

      // Centrar en la ubicación del usuario
      mapInstanceRef.current.setView(userLocation, 14);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Agregar marcadores de partidos
    partidos.forEach(partido => {
      if (!partido.lat || !partido.lng) return;

      // Icono personalizado para partidos
      const partidoIcon = L.divIcon({
        className: 'partido-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 20px;
              font-weight: bold;
            ">⚽</span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([partido.lat, partido.lng], { icon: partidoIcon })
        .addTo(mapInstanceRef.current);

      // Popup con información del partido
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
            ${partido.nombreFormato}
          </h3>
          <p style="margin: 4px 0; font-size: 14px; color: #666;">
            📅 ${partido.fecha} • ${partido.hora}hs
          </p>
          <p style="margin: 4px 0; font-size: 14px; color: #666;">
            📍 ${partido.barrio}, ${partido.localidad}
          </p>
          <p style="margin: 4px 0; font-size: 14px; color: #666;">
            👥 ${partido.jugadores?.length || 1}/${partido.jugadoresMaximos} jugadores
          </p>
          <button 
            onclick="window.location.href='/partidos/${partido.id}'"
            style="
              margin-top: 8px;
              width: 100%;
              padding: 8px;
              background: var(--color-primary);
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 500;
            "
          >
            Ver Detalles
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onPartidoClick) {
        marker.on('click', () => onPartidoClick(partido));
      }

      markersRef.current.push(marker);
    });

    // Ajustar vista para mostrar todos los marcadores
    if (partidos.length > 0 && partidos.some(p => p.lat && p.lng)) {
      const bounds = L.latLngBounds(
        partidos
          .filter(p => p.lat && p.lng)
          .map(p => [p.lat, p.lng])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [partidos, onPartidoClick]);

  return (
    <div 
      ref={mapRef} 
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ height: '100%', minHeight: '400px' }}
    />
  );
}
