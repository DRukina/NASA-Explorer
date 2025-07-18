export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  cached?: boolean;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface ApodData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
  thumbnail_url?: string;
}

export interface NeoData {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NearEarthObject[];
  };
}

export interface NearEarthObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: DiameterRange;
    meters: DiameterRange;
    miles: DiameterRange;
    feet: DiameterRange;
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: OrbitalData;
  is_sentry_object: boolean;
}

export interface DiameterRange {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

export interface CloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface OrbitalData {
  orbit_id: string;
  orbit_determination_date: string;
  first_observation_date: string;
  last_observation_date: string;
  data_arc_in_days: number;
  observations_used: number;
  orbit_uncertainty: string;
  minimum_orbit_intersection: string;
  jupiter_tisserand_invariant: string;
  epoch_osculation: string;
  eccentricity: string;
  semi_major_axis: string;
  inclination: string;
  ascending_node_longitude: string;
  orbital_period: string;
  perihelion_distance: string;
  perihelion_argument: string;
  aphelion_distance: string;
  perihelion_time: string;
  mean_anomaly: string;
  mean_motion: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  hazardous?: boolean;
  minSize?: number;
  maxSize?: number;
  sortBy?: 'date' | 'size' | 'distance' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ChartDataPoint {
  date: string;
  count: number;
  hazardous: number;
  averageSize: number;
  closestDistance: number;
}

export interface AsteroidChartData {
  name: string;
  size: number;
  distance: number;
  date: string;
  hazardous: boolean;
  velocity: number;
}
