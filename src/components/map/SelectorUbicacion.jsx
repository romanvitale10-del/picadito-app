import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, X, Navigation } from 'lucide-react';
import { obtenerDireccion } from '../../hooks/useGeolocation';

// Fix para los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function SelectorUbicacion({ onUbicacionSeleccionada, ubicacionInicial }) {
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [ubicacion, setUbicacion] = useState(ubicacionInicial || null);
  const [cargandoDireccion, setCargandoDireccion] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mostrarMapa && !mapInstanceRef.current) {
      // Inicializar mapa centrado en Buenos Aires por defecto
      const center = ubicacion || [-34.6037, -58.3816];
      
      mapInstanceRef.current = L.map(mapRef.current).setView(center, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Agregar marcador si hay ubicación inicial
      if (ubicacion) {
        markerRef.current = L.marker(ubicacion, { draggable: true })
          .addTo(mapInstanceRef.current);
        
        markerRef.current.on('dragend', handleMarkerDrag);
      }

      // Click en el mapa para colocar/mover marcador
      mapInstanceRef.current.on('click', handleMapClick);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [mostrarMapa]);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    
    // Actualizar o crear marcador
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true })
        .addTo(mapInstanceRef.current);
      markerRef.current.on('dragend', handleMarkerDrag);
    }

    await actualizarUbicacion(lat, lng);
  };

  const handleMarkerDrag = async (e) => {
    const { lat, lng } = e.target.getLatLng();
    await actualizarUbicacion(lat, lng);
  };

  const actualizarUbicacion = async (lat, lng) => {
    setCargandoDireccion(true);
    
    // Obtener dirección usando geocoding inverso
    const direccion = await obtenerDireccion(lat, lng);
    
    const nuevaUbicacion = {
      lat,
      lng,
      barrio: direccion?.barrio || '',
      localidad: direccion?.localidad || '',
      provincia: direccion?.provincia || '',
      direccion: direccion?.direccion || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    };

    setUbicacion(nuevaUbicacion);
    setCargandoDireccion(false);
  };

  const handleUbicacionActual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            
            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            } else {
              markerRef.current = L.marker([latitude, longitude], { draggable: true })
                .addTo(mapInstanceRef.current);
              markerRef.current.on('dragend', handleMarkerDrag);
            }
            
            actualizarUbicacion(latitude, longitude);
          }
        },
        (error) => {
          console.error('Error al obtener ubicación:', error);
          alert('No se pudo obtener tu ubicación. Verifica los permisos del navegador.');
        }
      );
    }
  };

  const confirmarUbicacion = () => {
    if (ubicacion) {
      onUbicacionSeleccionada(ubicacion);
      setMostrarMapa(false);
    }
  };

  return (
    <div>
      {/* Botón para abrir selector */}
      {!mostrarMapa && (
        <button
          type="button"
          onClick={() => setMostrarMapa(true)}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          <MapPin className="w-5 h-5" />
          {ubicacion ? 'Cambiar ubicación en el mapa' : 'Seleccionar ubicación en el mapa'}
        </button>
      )}

      {/* Ubicación seleccionada */}
      {ubicacion && !mostrarMapa && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                📍 Ubicación seleccionada
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                {ubicacion.barrio && `${ubicacion.barrio}, `}
                {ubicacion.localidad}
              </p>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                Lat: {ubicacion.lat.toFixed(6)}, Lng: {ubicacion.lng.toFixed(6)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setUbicacion(null);
                onUbicacionSeleccionada(null);
              }}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modal del mapa */}
      {mostrarMapa && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Seleccionar ubicación del partido</h3>
                <button
                  onClick={() => setMostrarMapa(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Hacé click en el mapa o arrastrá el marcador para seleccionar la ubicación
              </p>
            </div>

            {/* Mapa */}
            <div className="flex-1 relative">
              <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />
              
              {/* Botón de ubicación actual */}
              <button
                type="button"
                onClick={handleUbicacionActual}
                className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                title="Usar mi ubicación actual"
              >
                <Navigation className="w-5 h-5" />
              </button>

              {/* Indicador de carga */}
              {cargandoDireccion && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Obteniendo dirección...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer con ubicación y acciones */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {ubicacion && (
                <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm font-medium">Ubicación seleccionada:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {ubicacion.direccion}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMostrarMapa(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarUbicacion}
                  disabled={!ubicacion}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar ubicación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
