import { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';

interface Barbearia {
  id: string;
  nome: string;
  latitude?: number | null;
  longitude?: number | null;
  endereco?: string;
  cidade?: string;
  bairro?: string;
}

interface GoogleMapsBarberProps {
  barbearias: Barbearia[];
  onMarkerClick?: (barbeariaId: string) => void;
  height?: string;
}

export default function GoogleMapsBarber({ 
  barbearias, 
  onMarkerClick,
  height = "300px" 
}: GoogleMapsBarberProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('API Key do Google Maps não configurada');
      setLoading(false);
      return;
    }

    if (window.google?.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeMap();
    };
    
    script.onerror = () => {
      setError('Erro ao carregar Google Maps');
      setLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Default center (Brasil)
    const defaultCenter = { lat: -23.5505, lng: -46.6333 }; // São Paulo

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    setMap(mapInstance);
    setLoading(false);
  };

  // Update markers when barbearias change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Filter barbearias with coordinates
    const barbeariasComCoordenadas = barbearias.filter(
      b => b.latitude != null && b.longitude != null
    );

    if (barbeariasComCoordenadas.length === 0) {
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    barbeariasComCoordenadas.forEach(barbearia => {
      const position = {
        lat: barbearia.latitude!,
        lng: barbearia.longitude!
      };

      const marker = new window.google.maps.Marker({
        position,
        map,
        title: barbearia.nome,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="hsl(0, 84%, 60%)" width="32" height="32">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        }
      });

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">${barbearia.nome}</h3>
            ${barbearia.bairro || barbearia.cidade ? `
              <p style="margin: 0; color: #666; font-size: 12px;">
                ${[barbearia.bairro, barbearia.cidade].filter(Boolean).join(', ')}
              </p>
            ` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close other info windows
        markersRef.current.forEach(m => {
          const iw = (m as any)._infoWindow;
          if (iw) iw.close();
        });
        
        infoWindow.open(map, marker);
        
        if (onMarkerClick) {
          onMarkerClick(barbearia.id);
        }
      });

      (marker as any)._infoWindow = infoWindow;
      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // Fit bounds if there are markers
    if (barbeariasComCoordenadas.length > 0) {
      map.fitBounds(bounds);
      
      // Don't zoom in too much
      const listener = map.addListener('idle', () => {
        const currentZoom = map.getZoom();
        if (currentZoom && currentZoom > 15) {
          map.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map, barbearias, onMarkerClick]);

  if (error) {
    return (
      <div 
        className="bg-muted rounded-lg flex items-center justify-center text-muted-foreground"
        style={{ height }}
      >
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden border" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Info overlay */}
      {!loading && barbearias.filter(b => b.latitude && b.longitude).length === 0 && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <p className="text-sm text-muted-foreground text-center px-4">
            Nenhuma barbearia com localização cadastrada
          </p>
        </div>
      )}
    </div>
  );
}
