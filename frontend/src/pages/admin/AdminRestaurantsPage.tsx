import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/reusable/DataTable';

import type { Column } from '@/components/reusable/DataTable';

// Restaurant type
interface Restaurant {
  _id: string;
  name: string;
  address: string;
}

// Props for the form
interface RestaurantFormProps {
  onSubmit: (values: Omit<Restaurant, '_id'>) => void;
  onCancel: () => void;
  initialData?: Restaurant | null;
  isPending: boolean;
}

const RestaurantForm: React.FC<RestaurantFormProps> = ({ onSubmit, onCancel, initialData, isPending }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAddress(initialData.address);
    } else {
      setName('');
      setAddress('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, address });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

const AdminRestaurantsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const columns: Column<Restaurant>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Address', accessor: 'address' },
  ];

  // Fetch restaurants
  const { data: restaurants, isLoading, isError } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await api.get('/restaurants');
      return response.data;
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newRestaurant: Omit<Restaurant, '_id'>) => api.post('/restaurants', newRestaurant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      setIsFormOpen(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (updatedRestaurant: Restaurant) => {
      const { _id, ...updateData } = updatedRestaurant;
      return api.patch(`/restaurants/${_id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      setIsFormOpen(false);
      setEditingRestaurant(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/restaurants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    },
  });

  const handleFormSubmit = (values: Omit<Restaurant, '_id'>) => {
    if (editingRestaurant) {
      updateMutation.mutate({ ...values, _id: editingRestaurant._id });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleAddNew = () => {
    setEditingRestaurant(null);
    setIsFormOpen(true);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingRestaurant(null);
  }

  const handleManageMenu = (id: string) => {
    navigate(`/admin/restaurants/${id}/menu`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching restaurants</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Restaurants</h1>
        {!isFormOpen && <Button onClick={handleAddNew}>Add New Restaurant</Button>}
      </div>

      {isFormOpen && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</CardTitle>
          </CardHeader>
          <CardContent>
            <RestaurantForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              initialData={editingRestaurant}
              isPending={createMutation.isPending || updateMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={restaurants || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageMenu={handleManageMenu}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRestaurantsPage;