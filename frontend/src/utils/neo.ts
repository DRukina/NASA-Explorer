import type {
  NeoData,
  NearEarthObject,
  ChartDataPoint,
  FilterOptions,
} from '../types/api';

export const calculateNeoStats = (neoData: NeoData) => {
  const allAsteroids = Object.values(neoData.near_earth_objects).flat();
  const hazardousCount = allAsteroids.filter(
    (a) => a.is_potentially_hazardous_asteroid
  ).length;

  const averageSize =
    allAsteroids.reduce((sum, asteroid) => {
      const avgDiameter =
        (asteroid.estimated_diameter.kilometers.estimated_diameter_min +
          asteroid.estimated_diameter.kilometers.estimated_diameter_max) /
        2;
      return sum + avgDiameter;
    }, 0) / allAsteroids.length;

  return {
    total: allAsteroids.length,
    hazardous: hazardousCount,
    safe: allAsteroids.length - hazardousCount,
    averageSize,
  };
};

export const transformNeoToChartData = (neoData: NeoData): ChartDataPoint[] => {
  const chartData: ChartDataPoint[] = [];

  for (const [date, asteroids] of Object.entries(neoData.near_earth_objects)) {
    const hazardousCount = asteroids.filter(
      (a) => a.is_potentially_hazardous_asteroid
    ).length;
    const totalCount = asteroids.length;

    const avgSize =
      asteroids.reduce((sum, asteroid) => {
        const avgDiameter =
          (asteroid.estimated_diameter.kilometers.estimated_diameter_min +
            asteroid.estimated_diameter.kilometers.estimated_diameter_max) /
          2;
        return sum + avgDiameter;
      }, 0) / asteroids.length;

    const closestDistance = Math.min(
      ...asteroids.map((asteroid) =>
        parseFloat(
          asteroid.close_approach_data[0]?.miss_distance.kilometers || '0'
        )
      )
    );

    chartData.push({
      date,
      count: totalCount,
      hazardous: hazardousCount,
      averageSize: avgSize,
      closestDistance: closestDistance / 1000000,
    });
  }

  return chartData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const filterAsteroids = (
  neoData: NeoData,
  filters?: FilterOptions
): Array<NearEarthObject & { approachDate: string }> => {
  let asteroids: Array<NearEarthObject & { approachDate: string }> = [];

  for (const [date, dateAsteroids] of Object.entries(
    neoData.near_earth_objects
  )) {
    asteroids.push(
      ...dateAsteroids.map((asteroid) => ({
        ...asteroid,
        approachDate: date,
      }))
    );
  }

  if (!filters) return asteroids;

  if (filters.hazardous !== undefined) {
    asteroids = asteroids.filter(
      (a) => a.is_potentially_hazardous_asteroid === filters.hazardous
    );
  }

  if (filters.minSize !== undefined || filters.maxSize !== undefined) {
    asteroids = asteroids.filter((asteroid) => {
      const avgSize =
        (asteroid.estimated_diameter.kilometers.estimated_diameter_min +
          asteroid.estimated_diameter.kilometers.estimated_diameter_max) /
        2;

      if (filters.minSize !== undefined && avgSize < filters.minSize)
        return false;
      if (filters.maxSize !== undefined && avgSize > filters.maxSize)
        return false;
      return true;
    });
  }

  if (filters.sortBy) {
    asteroids.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (filters.sortBy) {
        case 'date':
          aValue = new Date(a.approachDate);
          bValue = new Date(b.approachDate);
          break;
        case 'size':
          aValue =
            (a.estimated_diameter.kilometers.estimated_diameter_min +
              a.estimated_diameter.kilometers.estimated_diameter_max) /
            2;
          bValue =
            (b.estimated_diameter.kilometers.estimated_diameter_min +
              b.estimated_diameter.kilometers.estimated_diameter_max) /
            2;
          break;
        case 'distance':
          aValue = parseFloat(
            a.close_approach_data[0]?.miss_distance.kilometers || '0'
          );
          bValue = parseFloat(
            b.close_approach_data[0]?.miss_distance.kilometers || '0'
          );
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
      if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
      return 0;
    });
  }

  return asteroids;
};

export const getAsteroidSize = (asteroid: NearEarthObject): number => {
  return (
    (asteroid.estimated_diameter.kilometers.estimated_diameter_min +
      asteroid.estimated_diameter.kilometers.estimated_diameter_max) /
    2
  );
};

export const getAsteroidDistance = (asteroid: NearEarthObject): number => {
  return parseFloat(
    asteroid.close_approach_data[0]?.miss_distance.kilometers || '0'
  );
};

export const getAsteroidVelocity = (asteroid: NearEarthObject): number => {
  return parseFloat(
    asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_hour ||
      '0'
  );
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(2);
};
