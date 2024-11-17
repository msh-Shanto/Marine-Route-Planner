import React, { useState } from 'react';
import { Anchor, Pencil } from 'lucide-react';
import { DrawableMap } from './components/DrawableMap';
import { Landmark } from './types';

function App() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  const handleAddLandmark = (landmark: Landmark) => {
    setLandmarks(prev => [...prev, landmark]);
  };

  const handleRemoveLandmark = (id: string) => {
    setLandmarks(prev => prev.filter(landmark => landmark.id !== id));
  };

  const handleClearAll = () => {
    setLandmarks([]);
    setDistance(null);
  };

  const handleDistanceUpdate = (newDistance: number) => {
    setDistance(newDistance || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Anchor className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Maritime Route Planner By Shanto</h1>
          <p className="text-lg text-gray-600">Create custom routes between your landmarks</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Pencil className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Click "Add Start Point" and select a location on the map</li>
                <li>Enter a name for your starting point</li>
                <li>Add an end point in the same way</li>
                <li>Use the polyline tool (↗) to draw your route</li>
                <li>Click points on the map to create route segments</li>
                <li>Double-click to finish drawing</li>
                <li>Use the edit tool to modify existing routes</li>
                <li>Use the trash tool to delete routes</li>
                <li>Click "Download Map" to save your route as an image</li>
                <li>Click the "Clear All" button to remove all points and routes</li>
              </ul>
            </div>
          </div>

          <DrawableMap 
            landmarks={landmarks}
            onAddLandmark={handleAddLandmark}
            onRemoveLandmark={handleRemoveLandmark}
            onClearAll={handleClearAll}
            onDistanceUpdate={handleDistanceUpdate}
            distance={distance}
          />

          {distance !== null && (
            <div className="mt-6 bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Route Details</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {landmarks.length === 2 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-3">
                    <div className="text-sm text-gray-600 mb-2">Route</div>
                    <div className="text-lg font-semibold">
                      {landmarks[0].name} → {landmarks[1].name}
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Nautical Miles</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(distance).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Kilometers</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(distance * 1.852).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Miles</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(distance * 1.15078).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-sm text-gray-600">
          <p>Draw your own routes to calculate precise maritime distances between custom landmarks</p>
        </footer>
      </div>
    </div>
  );
}

export default App;