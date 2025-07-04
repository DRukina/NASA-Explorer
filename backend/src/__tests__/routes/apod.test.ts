import request from 'supertest';
import app from '../../app';
import { nasaService } from '../../services/nasaService';
import { ApodResponse } from '../../types/nasa';

// Mock the NASA service
jest.mock('../../services/nasaService');
const mockNasaService = nasaService as jest.Mocked<typeof nasaService>;

describe('APOD Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/apod', () => {
    const mockApodResponse: ApodResponse = {
      date: '2024-01-01',
      explanation: 'A beautiful space image',
      media_type: 'image',
      service_version: 'v1',
      title: 'Test Space Image',
      url: 'https://example.com/image.jpg',
      hdurl: 'https://example.com/hd-image.jpg',
      copyright: 'NASA',
    };

    it("should return today's APOD when no date is provided", async () => {
      mockNasaService.getApod.mockResolvedValue(mockApodResponse);

      const response = await request(app).get('/api/apod').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockApodResponse,
        timestamp: expect.any(String),
      });

      expect(mockNasaService.getApod).toHaveBeenCalledWith(undefined);
    });

    it('should return APOD for specific date', async () => {
      const specificDate = '2023-12-25';
      mockNasaService.getApod.mockResolvedValue({
        ...mockApodResponse,
        date: specificDate,
      });

      const response = await request(app).get(`/api/apod?date=${specificDate}`).expect(200);

      expect(response.body.data.date).toBe(specificDate);
      expect(mockNasaService.getApod).toHaveBeenCalledWith(specificDate);
    });

    it('should return 400 for invalid date format', async () => {
      const response = await request(app).get('/api/apod?date=invalid-date').expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('date'),
          status: 400,
        },
      });
    });

    it('should return 400 for future date', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      const response = await request(app).get(`/api/apod?date=${futureDateString}`).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('future'),
          status: 400,
        },
      });
    });

    it('should handle NASA API errors', async () => {
      mockNasaService.getApod.mockRejectedValue(new Error('NASA API Error'));

      const response = await request(app).get('/api/apod').expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.any(String),
          status: 500,
        },
      });
    });
  });

  describe('GET /api/apod/random', () => {
    const mockRandomApodResponse: ApodResponse[] = [
      {
        date: '2024-01-01',
        explanation: 'Random space image 1',
        media_type: 'image',
        service_version: 'v1',
        title: 'Random Test Image 1',
        url: 'https://example.com/random1.jpg',
      },
      {
        date: '2024-01-02',
        explanation: 'Random space image 2',
        media_type: 'image',
        service_version: 'v1',
        title: 'Random Test Image 2',
        url: 'https://example.com/random2.jpg',
      },
    ];

    it('should return random APOD with default count', async () => {
      mockNasaService.getRandomApod.mockResolvedValue(mockRandomApodResponse[0]);

      const response = await request(app).get('/api/apod/random').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: mockRandomApodResponse[0],
        timestamp: expect.any(String),
      });

      expect(mockNasaService.getRandomApod).toHaveBeenCalledWith(1);
    });

    it('should return multiple random APODs when count is specified', async () => {
      mockNasaService.getRandomApod.mockResolvedValue(mockRandomApodResponse);

      const response = await request(app).get('/api/apod/random?count=2').expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(mockNasaService.getRandomApod).toHaveBeenCalledWith(2);
    });

    it('should return 400 for count exceeding maximum', async () => {
      const response = await request(app).get('/api/apod/random?count=15').expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Count cannot exceed 10',
          status: 400,
        },
      });
    });

    it('should return 400 for invalid count', async () => {
      const response = await request(app).get('/api/apod/random?count=invalid').expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Count must be a positive integer',
          status: 400,
        },
      });
    });
  });

  describe('GET /api/apod/range', () => {
    const mockRangeResponse: ApodResponse[] = [
      {
        date: '2024-01-01',
        explanation: 'Range image 1',
        media_type: 'image',
        service_version: 'v1',
        title: 'Range Test Image 1',
        url: 'https://example.com/range1.jpg',
      },
      {
        date: '2024-01-02',
        explanation: 'Range image 2',
        media_type: 'image',
        service_version: 'v1',
        title: 'Range Test Image 2',
        url: 'https://example.com/range2.jpg',
      },
    ];

    it('should return APOD range for valid date range', async () => {
      mockNasaService.getApodRange.mockResolvedValue(mockRangeResponse);

      const response = await request(app)
        .get('/api/apod/range?start_date=2024-01-01&end_date=2024-01-02')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(mockNasaService.getApodRange).toHaveBeenCalledWith('2024-01-01', '2024-01-02');
    });

    it('should return 400 when start_date is missing', async () => {
      const response = await request(app).get('/api/apod/range?end_date=2024-01-02').expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('start_date'),
          status: 400,
        },
      });
    });

    it('should return 400 when end_date is missing', async () => {
      const response = await request(app).get('/api/apod/range?start_date=2024-01-01').expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('end_date'),
          status: 400,
        },
      });
    });

    it('should return 400 when date range exceeds maximum', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-02-15'; // More than 30 days

      const response = await request(app)
        .get(`/api/apod/range?start_date=${startDate}&end_date=${endDate}`)
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
        .get('/api/apod/range?start_date=2024-01-02&end_date=2024-01-01')
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('start_date'),
          status: 400,
        },
      });
    });
  });

  describe('Caching', () => {
    it('should include cache headers in response', async () => {
      const mockApodResponse: ApodResponse = {
        date: '2024-01-01',
        explanation: 'Cached image',
        media_type: 'image',
        service_version: 'v1',
        title: 'Cached Test Image',
        url: 'https://example.com/cached.jpg',
      };

      mockNasaService.getApod.mockResolvedValue(mockApodResponse);

      const response = await request(app).get('/api/apod').expect(200);

      expect(response.body).toHaveProperty('cached');
      expect(typeof response.body.cached).toBe('boolean');
    });
  });
});
