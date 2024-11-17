export interface Landmark {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'start' | 'end';
}

export interface DistanceResult {
  nauticalMiles: number;
  kilometers: number;
}