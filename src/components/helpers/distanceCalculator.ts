// Haversine formula, which determines the great-circle distance between two points on a sphere given their longitudes and latitudes.

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(0));
  const distance = R * c; // Distance in kilometers
  return parseFloat(distance.toFixed(2)); // Return distance to 2 decimal places
};

const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};
