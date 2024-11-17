import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Icon, FeatureGroup, LatLng } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-draw';
import { Trash2, X } from 'lucide-react';
import { Landmark } from '../types';

const startIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface DrawableMapProps {
  landmarks: Landmark[];
  onAddLandmark: (landmark: Landmark) => void;
  onRemoveLandmark: (id: string) => void;
  onClearAll: () => void;
  onDistanceUpdate: (distance: number) => void;
  distance: number | null;
}

function DrawControl({ onDistanceUpdate }: { onDistanceUpdate: (distance: number) => void }) {
  const map = useMap();
  const drawRef = useRef<any>(null);
  const drawnItemsRef = useRef(new L.FeatureGroup());

  useEffect(() => {
    map.addLayer(drawnItemsRef.current);

    const drawControl = new L.Control.Draw({
      draw: {
        marker: false,
        circle: false,
        rectangle: false,
        circlemarker: false,
        polygon: false,
        polyline: {
          shapeOptions: {
            color: '#2563eb',
            weight: 3,
          },
          metric: false,
          feet: false,
          nautic: true,
        },
      },
      edit: {
        featureGroup: drawnItemsRef.current,
      },
    });

    map.addControl(drawControl);
    drawRef.current = drawControl;

    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawnItemsRef.current.addLayer(layer);
      calculateDistance(drawnItemsRef.current);
    });

    map.on(L.Draw.Event.EDITED, () => {
      calculateDistance(drawnItemsRef.current);
    });

    map.on(L.Draw.Event.DELETED, () => {
      calculateDistance(drawnItemsRef.current);
    });

    return () => {
      map.removeControl(drawRef.current);
      map.removeLayer(drawnItemsRef.current);
    };
  }, [map, onDistanceUpdate]);

  const calculateDistance = (featureGroup: L.FeatureGroup) => {
    let totalDistance = 0;
    featureGroup.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline) {
        const latlngs = layer.getLatLngs();
        for (let i = 0; i < latlngs.length - 1; i++) {
          totalDistance += latlngs[i].distanceTo(latlngs[i + 1]) / 1852;
        }
      }
    });
    onDistanceUpdate(totalDistance);
  };

  return null;
}

function AddLandmarkControl({ onAddLandmark }: { onAddLandmark: (coords: LatLng) => void }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onAddLandmark(e.latlng);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onAddLandmark]);

  return null;
}

export function DrawableMap({ 
  landmarks, 
  onAddLandmark, 
  onRemoveLandmark,
  onClearAll,
  onDistanceUpdate,
  distance 
}: DrawableMapProps) {
  const [isAddingLandmark, setIsAddingLandmark] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handleAddLandmark = (coords: LatLng) => {
    if (!isAddingLandmark) return;
    
    const name = prompt('Enter landmark name:');
    if (!name) return;

    const type = landmarks.length === 0 ? 'start' : 'end';
    onAddLandmark({
      id: Date.now().toString(),
      name,
      coordinates: [coords.lat, coords.lng],
      type
    });

    if (type === 'end') {
      setIsAddingLandmark(false);
    }
  };

  const handleClearAll = () => {
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.FeatureGroup) {
          layer.clearLayers();
        }
      });
      onDistanceUpdate(0);
    }
    onClearAll();
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        {landmarks.length < 2 && (
          <button
            onClick={() => setIsAddingLandmark(!isAddingLandmark)}
            className={`px-4 py-2 rounded-lg shadow-md ${
              isAddingLandmark 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAddingLandmark ? 'Cancel' : `Add ${landmarks.length === 0 ? 'Start' : 'End'} Point`}
          </button>
        )}
        {(landmarks.length > 0 || mapRef.current?.getPanes().overlayPane?.children.length) && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-lg shadow-md bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>
      
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        {landmarks.map((landmark) => (
          <div
            key={landmark.id}
            className="bg-white rounded-lg shadow-md p-2 pr-8 relative flex items-center gap-2"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                landmark.type === 'start' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium">{landmark.name}</span>
            <button
              onClick={() => onRemoveLandmark(landmark.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <MapContainer
        ref={mapRef}
        center={[20, 0]}
        zoom={2}
        style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
        className="shadow-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {landmarks.map((landmark) => (
          <Marker 
            key={landmark.id} 
            position={landmark.coordinates}
            icon={landmark.type === 'start' ? startIcon : endIcon}
          >
            <Popup>
              <div className="font-semibold">{landmark.name}</div>
              <div className="text-sm text-gray-600">
                {landmark.type === 'start' ? 'Starting Point' : 'End Point'}
              </div>
            </Popup>
          </Marker>
        ))}
        <DrawControl onDistanceUpdate={onDistanceUpdate} />
        {isAddingLandmark && <AddLandmarkControl onAddLandmark={handleAddLandmark} />}
      </MapContainer>
    </div>
  );
}