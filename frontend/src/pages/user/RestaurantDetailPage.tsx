import { FaCartPlus } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import { BsPersonFillUp } from "react-icons/bs";

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
  const [allOrderedForNames, setAllOrderedForNames] = useLocalStorage<string[]>('orderedForNames', []);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  React.useEffect(() => {
    if (orderedFor) {
      setSuggestions(
        allOrderedForNames.filter((name) =>
          name.toLowerCase().includes(orderedFor.toLowerCase())
        )
      );
    } else {
      setSuggestions(allOrderedForNames);
    }
  }, [orderedFor, allOrderedForNames]);

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
      {/* <CardHeader> */}
      <CardTitle className='mb-2 underline underline-offset-4'>{restaurant.name} Menu</CardTitle>
      {/* </CardHeader> */}
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
                <Button className="mt-2" onClick={() => addToCart(item)}><FaCartPlus className="mr-2" />To Cart</Button>
                <Button className="mt-2 ml-2" onClick={() => setSelectedItem(item)}><BsPersonFillUp className="mr-2" />Order For</Button>
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
              onChange={(e) => {
                setOrderedFor(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              className="border p-2 rounded w-full mb-2"
              placeholder="Enter name"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="border rounded bg-white absolute z-10 w-full max-h-40 max-w-[270px] overflow-y-auto">
                {suggestions.map((name) => (
                  <li
                    key={name}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setOrderedFor(name);
                      setShowSuggestions(false);
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
            {showSuggestions && suggestions.length === 0 && orderedFor && (
              <div className="border rounded bg-white absolute z-10 w-full p-2 max-w-[270px] ">
                <Button variant="ghost" className="w-full justify-start" onClick={() => {
                  if (orderedFor && !allOrderedForNames.includes(orderedFor)) {
                    setAllOrderedForNames([...allOrderedForNames, orderedFor]);
                  }
                  setShowSuggestions(false);
                }}>
                  Add "{orderedFor}" as new
                </Button>
              </div>
            )}
            <Button onClick={() => {
              addToCart(selectedItem, orderedFor);
              setSelectedItem(null);
              setOrderedFor('');
            }}>Save</Button>
            <Button className="ml-2" onClick={() => {
              setSelectedItem(null);
              setOrderedFor('');
            }}>Cancel</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default RestaurantDetailPage;