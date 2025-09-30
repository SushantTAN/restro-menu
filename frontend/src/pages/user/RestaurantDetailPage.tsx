import { FaCartPlus } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';

// Restaurant type
interface Restaurant {
  _id: string;
  name: string;
  address: string;
}

// MenuItem type
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(null);
  const [orderedFor, setOrderedFor] = React.useState('');

  // Fetch restaurant details
  const { data: restaurant, isLoading: isLoadingRestaurant, isError: isErrorRestaurant } = useQuery<Restaurant>({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if the id is present
  });

  // Fetch menu items
  const { data: menuItems, isLoading: isLoadingMenu, isError: isErrorMenu } = useQuery<MenuItem[]>({
    queryKey: ['menu', id],
    queryFn: async () => {
      const response = await api.get(`/menu/restaurant/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoadingRestaurant || isLoadingMenu) {
    return <div>Loading...</div>;
  }

  if (isErrorRestaurant || !restaurant) {
    return <div>Error fetching restaurant details</div>;
  }

  return (
    <section>
      <CardHeader>
        <CardTitle>{restaurant.name} Menu</CardTitle>
      </CardHeader>
      {isErrorMenu ? (
        <div>Error fetching menu items</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems?.map((item) => (
            <Card key={item._id}>
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
              )}
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* <p>{item.description}</p> */}
                <p className="font-medium mt-2">Rs {item.price.toFixed(2)}</p>
                {/* <div className='bg-secondary h-12 w-12' ></div> */}
                <Button className="mt-4" onClick={() => addToCart(item)}><FaCartPlus className="mr-2" />To Cart</Button>
                <Button className="mt-4 ml-2" onClick={() => setSelectedItem(item)}>Order For</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Order for {selectedItem.name}</h2>
            <input
              type="text"
              value={orderedFor}
              onChange={(e) => setOrderedFor(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Enter name"
            />
            <Button onClick={() => {
              addToCart(selectedItem, orderedFor);
              setSelectedItem(null);
              setOrderedFor('');
            }}>Save</Button>
            <Button className="ml-2" onClick={() => setSelectedItem(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default RestaurantDetailPage;