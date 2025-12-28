import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useListings, Listing } from '@/hooks/useListings';

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'farm': return '#4A7C59';
    case 'market': return '#8B7355';
    case 'restaurant': return '#C4A77D';
    default: return '#4A7C59';
  }
};

interface InteractiveMapProps {
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  
  const { data: listings } = useListings();

  const addMarkersToMap = useCallback((listingsData: Listing[]) => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    listingsData.forEach((listing) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `
        width: 36px;
        height: 36px;
        background-color: ${getMarkerColor(listing.type)};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 3px solid white;
        transition: transform 0.2s ease;
      `;
      el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${listing.type === 'farm' ? '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>' : 
        listing.type === 'market' ? '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>' : 
        '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>'}
      </svg>`;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const practicesHtml = listing.practices && listing.practices.length > 0 
        ? `<div style="margin-bottom: 8px;">
            <p style="font-size: 11px; font-weight: 600; color: #2D3A2E; margin-bottom: 4px;">Practices:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${listing.practices.map(p => `<span style="font-size: 10px; padding: 2px 6px; background: #E8EDE5; border-radius: 4px; color: #4A7C59;">${p}</span>`).join('')}
            </div>
          </div>`
        : '';

      const productsHtml = listing.products && listing.products.length > 0
        ? `<div>
            <p style="font-size: 11px; font-weight: 600; color: #2D3A2E; margin-bottom: 4px;">Products:</p>
            <p style="font-size: 12px; color: #5A6B5D;">${listing.products.join(' • ')}</p>
          </div>`
        : '';

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
      }).setHTML(`
        <div style="font-family: 'DM Sans', sans-serif; padding: 8px;">
          <h3 style="font-family: 'Fraunces', serif; font-size: 16px; font-weight: 600; margin-bottom: 6px; color: #2D3A2E;">
            ${listing.name}
          </h3>
          <span style="display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 12px; background-color: ${getMarkerColor(listing.type)}22; color: ${getMarkerColor(listing.type)}; font-weight: 500; margin-bottom: 8px; text-transform: capitalize;">
            ${listing.type}
          </span>
          ${listing.is_verified ? '<span style="display: inline-block; margin-left: 4px; font-size: 10px; padding: 2px 6px; border-radius: 12px; background-color: #4A7C5922; color: #4A7C59; font-weight: 500;">✓ Verified</span>' : ''}
          <p style="font-size: 13px; color: #5A6B5D; margin-bottom: 10px; line-height: 1.4;">
            ${listing.description}
          </p>
          <p style="font-size: 12px; color: #5A6B5D; margin-bottom: 8px;">
            📍 ${listing.city}, ${listing.state}
          </p>
          ${practicesHtml}
          ${productsHtml}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([listing.longitude, listing.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      markersRef.current.push(marker);
    });
  }, []);

  const initializeMap = useCallback((token: string) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [-122.4194, 37.7749],
        zoom: 10,
        pitch: 30,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        setIsMapLoaded(true);
        if (listings && listings.length > 0) {
          addMarkersToMap(listings);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsMapLoaded(false);
    }
  }, [listings, addMarkersToMap]);

  // Add markers when listings change
  useEffect(() => {
    if (isMapLoaded && listings) {
      addMarkersToMap(listings);
    }
  }, [listings, isMapLoaded, addMarkersToMap]);

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      setMapboxToken(tokenInput.trim());
      localStorage.setItem('mapbox_token', tokenInput.trim());
      initializeMap(tokenInput.trim());
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setTokenInput(savedToken);
      initializeMap(savedToken);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  if (!mapboxToken) {
    return (
      <div className={`relative rounded-2xl overflow-hidden bg-card border border-border ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-sage/30 via-muted to-wheat/30">
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Connect Your Map
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Enter your Mapbox public token to enable the interactive map.
            Get your free token at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Input
              type="text"
              placeholder="pk.eyJ1Ijoi..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTokenSubmit} disabled={!tokenInput.trim()}>
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-card ${className}`}>
      <div ref={mapContainer} className="w-full h-full min-h-[400px]" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-6 p-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Farms</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-muted-foreground">Markets</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-muted-foreground">Restaurants</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
