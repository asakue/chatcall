'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { groups, groupChats } from '@/lib/groups-data';
import { savedRoutes } from '@/lib/routes-data';
import { useAppContext } from './app-provider';

// Fix for default icon not showing in Leaflet
const DefaultIcon = L.icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const createRemoveOverlayButton = (id: string, removeMapOverlay: (id: string) => void) => {
  const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
  container.style.backgroundColor = 'white';
  container.style.padding = '5px';
  container.style.cursor = 'pointer';
  container.title = 'Удалить зону поиска';
  
  const buttonContent = L.DomUtil.create('div', 'flex items-center justify-center w-full h-full', container);
  buttonContent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

  L.DomEvent.on(container, 'click', (e) => {
      e.stopPropagation();
      removeMapOverlay(id);
  });
  return container;
};

export default function MapViewLoader({ centerOn }: { centerOn?: [number, number] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlaysRef = useRef<Map<string, L.Layer>>(new Map());
  const { setView, mapOverlays, removeMapOverlay, viewProps } = useAppContext();
  const currentCenterOn = viewProps.centerOn as [number, number] | undefined || centerOn;


  const createStartPopupContent = useCallback((route: (typeof savedRoutes)[0]) => {
    const associatedGroup = groups.find(g => route.name.includes(g.name.split(' ')[0]));
    const hasChat = associatedGroup && groupChats[associatedGroup.id];
  
    const container = L.DomUtil.create('div');
    
    const title = L.DomUtil.create('div', 'font-bold text-base', container);
    title.innerText = `${route.name} (старт)`;

    const createTextLine = (text: string) => {
        const p = L.DomUtil.create('div', 'text-sm', container);
        p.innerText = text;
    };
    
    createTextLine(`Сложность: ${route.difficulty}`);
    createTextLine(`Расстояние: ${route.distance}`);
    createTextLine(`Время: ${route.time}`);
    createTextLine(`Высота: ${route.altitude}`);

    if (hasChat && associatedGroup) {
        const btn = L.DomUtil.create('button', 'text-blue-600 hover:underline cursor-pointer mt-2', container);
        btn.innerText = 'Перейти в чат';
        L.DomEvent.on(btn, 'click', () => {
            setView('chat', { groupId: associatedGroup.id });
        });
    }

    return container;
  }, [setView]);

  const createEndPopupContent = useCallback((route: (typeof savedRoutes)[0]) => {
    const container = L.DomUtil.create('div');
    
    const title = L.DomUtil.create('div', 'font-bold text-base', container);
    title.innerText = `${route.name} (финиш)`;
    
    const button = L.DomUtil.create('p', 'text-blue-600 hover:underline cursor-pointer mt-2', container);
    button.innerText = "К началу маршрута";
    L.DomEvent.on(button, 'click', () => {
        setView('map', { centerOn: route.path[0] });
    });

    return container;
  }, [setView]);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const center: [number, number] = [43.5, 42]; // Centered around the Caucasus
      
      const map = L.map(mapContainerRef.current, { attributionControl: false }).setView(center, 8);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      savedRoutes.forEach((route) => {
        if (route.path && route.path.length > 0) {
          const polyline = L.polyline(route.path, { color: 'hsl(var(--primary))', weight: 4 });
          polyline.addTo(map);

          const startCoords = route.path[0];
          const startPopupContent = createStartPopupContent(route);
          L.marker(startCoords, { icon: DefaultIcon }).addTo(map).bindPopup(startPopupContent);
            
          if (route.path.length > 1) {
            const endCoords = route.path[route.path.length - 1];
            const endPopupContent = createEndPopupContent(route);
            L.marker(endCoords, { icon: DefaultIcon }).addTo(map).bindPopup(endPopupContent);
          }
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [createEndPopupContent, createStartPopupContent]);

  // Handle centering
  useEffect(() => {
    if (mapRef.current && currentCenterOn) {
        mapRef.current.setView(currentCenterOn, 13);
    }
  }, [currentCenterOn]);

  // Handle overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentOverlayIds = new Set(mapOverlays.map(o => o.id));

    // Remove old overlays
    overlaysRef.current.forEach((layer, id) => {
      if (!currentOverlayIds.has(id)) {
        map.removeLayer(layer);
        overlaysRef.current.delete(id);
      }
    });

    // Add new overlays
    mapOverlays.forEach(overlay => {
      if (!overlaysRef.current.has(overlay.id)) {
        if (overlay.type === 'searchArea' && overlay.polygon.length > 0) {
          const polygon = L.polygon(overlay.polygon, {
            color: 'hsl(var(--accent))',
            fillColor: 'hsl(var(--accent))',
            fillOpacity: 0.2,
          }).addTo(map);
          
          const bounds = polygon.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
          }

          // Custom control to remove the polygon
          const CustomControl = L.Control.extend({
            onAdd: function() {
              return createRemoveOverlayButton(overlay.id, removeMapOverlay);
            },
            onRemove: function() {}
          });
          const customControl = new CustomControl({ position: 'topright' });

          customControl.addTo(map);
          
          const combinedLayer = L.layerGroup([polygon, (customControl as any)]);
          overlaysRef.current.set(overlay.id, combinedLayer);
        }
      }
    });

  }, [mapOverlays, removeMapOverlay]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
}
