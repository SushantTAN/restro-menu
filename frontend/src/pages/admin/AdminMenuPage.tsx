
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataTable from '@/components/reusable/DataTable';

import type { Column } from '@/components/reusable/DataTable';

// MenuItem type
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  restaurant: string;
}

// Props for the form
interface MenuItemFormProps {
  onSubmit: (values: FormData) => void;
  onCancel: () => void;
  initialData?: MenuItem | null;
  isPending: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ onSubmit, onCancel, initialData, isPending }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const { restaurantId } = useParams<{ restaurantId: string }>();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price.toString());
      setDescription(initialData.description || '');
    } else {
      setName('');
      setPrice('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }
    if (initialData) {
      formData.append('restaurant', initialData.restaurant);
    } else {
        if(restaurantId) {
            formData.append('restaurant', restaurantId);
        }
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
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

const AdminMenuPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const queryClient = useQueryClient();

  const columns: Column<MenuItem>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Price', accessor: 'price' },
    { header: 'Description', accessor: 'description' },
  ];

  // Fetch menu items
  const { data: menuItems, isLoading, isError } = useQuery<MenuItem[]>({
    queryKey: ['menu', restaurantId],
    queryFn: async () => {
      const response = await api.get(`/menu/restaurant/${restaurantId}`);
      return response.data;
    },
    enabled: !!restaurantId,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newMenuItem: FormData) => api.post('/menu', newMenuItem, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
      setIsFormOpen(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (updatedMenuItem: { id: string, data: FormData }) => {
      return api.patch(`/menu/${updatedMenuItem.id}`, updatedMenuItem.data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
      setIsFormOpen(false);
      setEditingMenuItem(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/menu/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
    },
  });

  const handleFormSubmit = (values: FormData) => {
    if (editingMenuItem) {
      updateMutation.mutate({ id: editingMenuItem._id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleAddNew = () => {
    setEditingMenuItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingMenuItem(null);
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching menu items</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Menu</h1>
        {!isFormOpen && <Button onClick={handleAddNew}>Add New Item</Button>}
      </div>

      {isFormOpen && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</CardTitle>
          </CardHeader>
          <CardContent>
            <MenuItemForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              initialData={editingMenuItem}
              isPending={createMutation.isPending || updateMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={menuItems || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMenuPage;
