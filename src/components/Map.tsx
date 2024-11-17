import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Port } from '../types';

// Fix for default marker icon in React-Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  ports: Port[];
  selectedPorts: [string, string];
}

export function Map({ ports, selectedPorts }: MapProps) {
  const selectedPortObjects = ports.filter(port => selectedPorts.includes(port.id));
  const coordinates = selectedPortObjects.map(port => port.coordinates);
  
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
      className="shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {selectedPortObjects.map((port) => (
        <Marker key={port.id} position={port.coordinates}>
          <Popup>
            <div className="font-semibold">{port.name}</div>
            <div className="text-sm text-gray-600">{port.country}</div>
          </Popup>
        </Marker>
      ))}
      {coordinates.length === 2 && (
        <Polyline
          positions={coordinates}
          color="#2563eb"
          weight={3}
          opacity={0.8}
          dashArray="10"
        />
      )}
    </MapContainer>
  );
}