import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRestaurantCount } from '../../services/restaurantService';

const AdminDashboardPage: React.FC = () => {
  const { data: totalRestaurants, isLoading, isError } = useQuery<number>({
    queryKey: ['totalRestaurants'],
    queryFn: getRestaurantCount,
  });

  if (isLoading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-xl text-red-500">Error loading data.</div>;
  }

  return (
    <div className="">
      <h1 className="text-3xl font-medium mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Restaurants</h2>
          <p className="text-4xl font-bold text-indigo-600">{totalRestaurants}</p>
        </div>
        {/* Add more metric cards here */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
