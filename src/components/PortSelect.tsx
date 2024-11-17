import React from 'react';
import { Port } from '../types';
import { MapPin } from 'lucide-react';

interface PortSelectProps {
  label: string;
  ports: Port[];
  value: string;
  onChange: (value: string) => void;
}

export function PortSelect({ label, ports, value, onChange }: PortSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
        >
          <option value="">Select a port</option>
          {ports.map((port) => (
            <option key={port.id} value={port.id}>
              {port.name}, {port.country}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}