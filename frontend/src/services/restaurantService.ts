import api from './api';

interface Restaurant {
  // Assuming a minimal structure for a restaurant object
  id: string;
  name: string;
  // Add other properties if needed for type safety, though not strictly necessary for just counting
}

export const getRestaurantCount = async (): Promise<number> => {
  const response = await api.get<Restaurant[]>('/restaurants');
  return response.data.length;
};
