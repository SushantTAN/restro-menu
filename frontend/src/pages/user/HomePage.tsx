import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Restaurant type
interface Restaurant {
  _id: string;
  name: string;
  address: string;
}

const HomePage: React.FC = () => {
  // Fetch restaurants
  const { data: restaurants, isLoading, isError } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await api.get('/restaurants');
      return response.data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching restaurants</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-medium mb-4">Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {restaurants?.map((restaurant) => (
          <Link to={`/restaurants/${restaurant._id}`} key={restaurant._id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{restaurant.address}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
