export const API_ENDPOINTS = {
  APOD: '/api/apod',
  APOD_RANDOM: '/api/apod?count=1',
  APOD_RANGE: '/api/apod',

  NEO: '/api/neo',
  NEO_FEED: '/api/neo',
  NEO_TODAY: '/api/neo?today=true',
  NEO_STATS: '/api/neo?stats=true',
  NEO_BY_ID: '/api/neo',

  HEALTH: '/api/health',
} as const;

export const QUERY_KEYS = {
  APOD: 'apod',
  NEO: 'neo',
  HEALTH: 'health',
} as const;

export const CACHE_TIMES = {
  APOD: 1000 * 60 * 10,
  APOD_RANDOM: 1000 * 60 * 5,
  APOD_RANGE: 1000 * 60 * 15,
  NEO: 1000 * 60 * 10,
  NEO_STATS: 1000 * 60 * 60,
  NEO_TODAY: 1000 * 60 * 30,
} as const;
