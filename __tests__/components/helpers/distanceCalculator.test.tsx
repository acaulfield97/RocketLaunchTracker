import {calculateDistance} from '../../../src/components/helpers/distanceCalculator';

describe('calculateDistance', () => {
  test('should calculate the correct distance between two points', () => {
    const lat1 = 40.758; // Times Square
    const lon1 = -73.9855;

    const lat2 = 40.748817; // Empire State Building
    const lon2 = -73.985428;

    // distance should be close to
    const expectedDistance = 1.02;
    expect(calculateDistance(lat1, lon1, lat2, lon2)).toBeCloseTo(
      expectedDistance,
      2,
    );
  });

  test('should return 0 if both points are the same', () => {
    const lat1 = 40.758;
    const lon1 = -73.9855;
    const lat2 = 40.758;
    const lon2 = -73.9855;

    expect(calculateDistance(lat1, lon1, lat2, lon2)).toBe(0);
  });

  test('should handle negative coordinates', () => {
    const lat1 = -33.8688; // Sydney
    const lon1 = 151.2093;

    const lat2 = 51.5074; // London
    const lon2 = -0.1278;

    // distance should be close to
    const expectedDistance = 16993.93;
    expect(calculateDistance(lat1, lon1, lat2, lon2)).toBeCloseTo(
      expectedDistance,
      2,
    );
  });
});
