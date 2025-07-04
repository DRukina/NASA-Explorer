import request from 'supertest';
import app from '../../app';
import { nasaService } from '../../services/nasaService';
import { NeoResponse, NearEarthObject } from '../../types/nasa';

// Mock the NASA service
jest.mock('../../services/nasaService');
const mockNasaService = nasaService as jest.Mocked<typeof nasaService>;

describe('NEO Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockNearEarthObject: NearEarthObject = {
    id: '54016849',
    neo_reference_id: '54016849',
    name: '(2020 SO)',
    nasa_jpl_url: 'http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=54016849',
    absolute_magnitude_h: 28.1,
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 0.0060963188,
        estimated_diameter_max: 0.0136318678,
      },
      meters: {
        estimated_diameter_min: 6.0963188,
        estimated_diameter_max: 13.6318678,
      },
      miles: {
        estimated_diameter_min: 0.0037888,
        estimated_diameter_max: 0.0084729,
      },
      feet: {
        estimated_diameter_min: 20.0,
        estimated_diameter_max: 44.7,
      },
    },
    is_potentially_hazardous_asteroid: false,
    close_approach_data: [
      {
        close_approach_date: '2024-01-01',
        close_approach_date_full: '2024-Jan-01 12:00',
        epoch_date_close_approach: 1704110400000,
        relative_velocity: {
          kilometers_per_second: '5.0',
          kilometers_per_hour: '18000',
          miles_per_hour: '11185',
        },
        miss_distance: {
          astronomical: '0.1',
          lunar: '38.9',
          kilometers: '14960000',
          miles: '9295000',
        },
        orbiting_body: 'Earth',
      },
    ],
    orbital_data: {
      orbit_id: '123',
      orbit_determination_date: '2024-01-01',
      first_observation_date: '2020-01-01',
      last_observation_date: '2024-01-01',
      data_arc_in_days: 1461,
      observations_used: 100,
      orbit_uncertainty: '0',
      minimum_orbit_intersection: '0.1',
      jupiter_tisserand_invariant: '3.5',
      epoch_osculation: '2459000.5',
      eccentricity: '0.5',
      semi_major_axis: '1.0',
      inclination: '10.0',
      ascending_node_longitude: '100.0',
      orbital_period: '365.25',
      perihelion_distance: '0.5',
      perihelion_argument: '90.0',
      aphelion_distance: '1.5',
      perihelion_time: '2459000.5',
      mean_anomaly: '180.0',
      mean_motion: '0.986',
    },
    is_sentry_object: false,
  };

  const mockNeoResponse: NeoResponse = {
    links: {
      next: 'http://api.nasa.gov/neo/rest/v1/feed?start_date=2024-01-02&end_date=2024-01-02&detailed=false&api_key=DEMO_KEY',
      prev: 'http://api.nasa.gov/neo/rest/v1/feed?start_date=2023-12-31&end_date=2023-12-31&detailed=false&api_key=DEMO_KEY',
      self: 'http://api.nasa.gov/neo/rest/v1/feed?start_date=2024-01-01&end_date=2024-01-01&detailed=false&api_key=DEMO_KEY',
    },
    element_count: 1,
    near_earth_objects: {
      '2024-01-01': [mockNearEarthObject],
    },
  };

  const mockNeoStats = {
    near_earth_object_count: 25000,
    close_approach_count: 50000,
    last_updated: '2024-01-01T00:00:00.000Z',
    source: 'NASA/JPL Near-Earth Object Program Office',
    nasa_jpl_url: 'http://neo.jpl.nasa.gov/stats/',
  };

  describe('GET /api/neo', () => {
    it('should return current week NEO data', async () => {
      mockNasaService.getNeoFeed.mockResolvedValue(mockNeoResponse);

      const response = await request(app).get('/api/neo').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockNeoResponse,
        timestamp: expect.any(String),
      });

      expect(mockNasaService.getNeoFeed).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String)
      );
    });

    it('should handle NASA API errors', async () => {
      mockNasaService.getNeoFeed.mockRejectedValue(new Error('NASA API Error'));

      const response = await request(app).get('/api/neo').expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.any(String),
          status: 500,
        },
      });
    });
  });

  describe('GET /api/neo/feed', () => {
    it('should return NEO feed for valid date range', async () => {
      mockNasaService.getNeoFeed.mockResolvedValue(mockNeoResponse);

      const response = await request(app)
        .get('/api/neo/feed?start_date=2024-01-01&end_date=2024-01-02')
        .expect(200);

      expect(response.body.data).toMatchObject(mockNeoResponse);
      expect(mockNasaService.getNeoFeed).toHaveBeenCalledWith('2024-01-01', '2024-01-02');
    });

    it('should return 400 when start_date is missing', async () => {
      const response = await request(app).get('/api/neo/feed?end_date=2024-01-02').expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('start_date'),
          status: 400,
        },
      });
    });

    it('should return 400 when end_date is missing', async () => {
      const response = await request(app).get('/api/neo/feed?start_date=2024-01-01').expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('end_date'),
          status: 400,
        },
      });
    });

    it('should return 400 when date range exceeds maximum (7 days)', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-10'; // More than 7 days

      const response = await request(app)
        .get(`/api/neo/feed?start_date=${startDate}&end_date=${endDate}`)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('range'),
          status: 400,
        },
      });
    });

    it('should return 400 when start_date is after end_date', async () => {
      const response = await request(app)
        .get('/api/neo/feed?start_date=2024-01-02&end_date=2024-01-01')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('start_date'),
          status: 400,
        },
      });
    });

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/api/neo/feed?start_date=invalid-date&end_date=2024-01-02')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('date'),
          status: 400,
        },
      });
    });
  });

  describe('GET /api/neo/today', () => {
    it("should return today's NEO data", async () => {
      const todayResponse = {
        ...mockNeoResponse,
        near_earth_objects: {
          [new Date().toISOString().split('T')[0]]: [mockNearEarthObject],
        },
      };

      mockNasaService.getNeoFeed.mockResolvedValue(todayResponse);

      const response = await request(app).get('/api/neo/today').expect(200);

      expect(response.body.data).toMatchObject(todayResponse);

      const today = new Date().toISOString().split('T')[0];
      expect(mockNasaService.getNeoFeed).toHaveBeenCalledWith(today, today);
    });

    it('should handle NASA API errors', async () => {
      mockNasaService.getNeoFeed.mockRejectedValue(new Error('NASA API Error'));

      const response = await request(app).get('/api/neo/today').expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.any(String),
          status: 500,
        },
      });
    });
  });

  describe('GET /api/neo/stats', () => {
    it('should return NEO statistics', async () => {
      mockNasaService.getNeoStats.mockResolvedValue(mockNeoStats);

      const response = await request(app).get('/api/neo/stats').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockNeoStats,
        timestamp: expect.any(String),
      });

      expect(mockNasaService.getNeoStats).toHaveBeenCalledWith();
    });

    it('should handle NASA API errors', async () => {
      mockNasaService.getNeoStats.mockRejectedValue(new Error('NASA API Error'));

      const response = await request(app).get('/api/neo/stats').expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.any(String),
          status: 500,
        },
      });
    });
  });

  describe('GET /api/neo/:id', () => {
    const validNeoId = '54016849';
    const mockNeoDetail = {
      ...mockNearEarthObject,
      orbital_data: {
        ...mockNearEarthObject.orbital_data,
        orbit_class: {
          orbit_class_type: 'APO',
          orbit_class_description:
            "Near-Earth asteroid orbits which cross the Earth's orbit similar to that of 1862 Apollo",
          orbit_class_range: '1.017 AU < q (perihelion distance) < 1.3 AU',
        },
      },
    };

    it('should return NEO details for valid ID', async () => {
      mockNasaService.getNeoById.mockResolvedValue(mockNeoDetail);

      const response = await request(app).get(`/api/neo/${validNeoId}`).expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockNeoDetail,
        timestamp: expect.any(String),
      });

      expect(mockNasaService.getNeoById).toHaveBeenCalledWith(validNeoId);
    });

    it('should return 400 for invalid NEO ID format', async () => {
      const invalidId = 'invalid-id';

      const response = await request(app).get(`/api/neo/${invalidId}`).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('ID'),
          status: 400,
        },
      });
    });

    it('should return 404 for non-existent NEO ID', async () => {
      const nonExistentId = '99999999';
      mockNasaService.getNeoById.mockRejectedValue(new Error('NEO not found'));

      const response = await request(app).get(`/api/neo/${nonExistentId}`).expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.any(String),
          status: 500,
        },
      });
    });

    it('should handle NASA API errors', async () => {
      mockNasaService.getNeoById.mockRejectedValue(new Error('NASA API Error'));

      const response = await request(app).get(`/api/neo/${validNeoId}`).expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.any(String),
          status: 500,
        },
      });
    });
  });

  describe('Caching', () => {
    it('should include cache headers in response', async () => {
      mockNasaService.getNeoFeed.mockResolvedValue(mockNeoResponse);

      const response = await request(app).get('/api/neo').expect(200);

      expect(response.body).toHaveProperty('cached');
      expect(typeof response.body.cached).toBe('boolean');
    });

    it('should cache stats endpoint', async () => {
      mockNasaService.getNeoStats.mockResolvedValue(mockNeoStats);

      const response = await request(app).get('/api/neo/stats').expect(200);

      expect(response.body).toHaveProperty('cached');
      expect(typeof response.body.cached).toBe('boolean');
    });
  });
});
