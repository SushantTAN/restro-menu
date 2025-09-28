import { CardTitle } from '@/components/ui/card';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';

// Restaurant type
interface Restaurant {
  _id: string;
  name: string;
  address: string;
}

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch restaurant details
  const { data: restaurant, isLoading, isError } = useQuery<Restaurant>({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if the id is present
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !restaurant) {
    return <div>Error fetching restaurant details</div>;
  }

  return (
    <section>
      {/* <CardHeader> */}
      <CardTitle>{restaurant.name} Menu</CardTitle>
      {/* </CardHeader> */}
    </section>
  );
};

export default RestaurantDetailPage;
