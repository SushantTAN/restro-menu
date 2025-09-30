import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const ManageOrderedForNamesPage: React.FC = () => {
  const [allOrderedForNames, setAllOrderedForNames] = useLocalStorage<string[]>('orderedForNames', []);
  const [newName, setNewName] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editedNameValue, setEditedNameValue] = useState<string>('');

  const handleAddName = () => {
    if (newName.trim() !== '' && !allOrderedForNames.includes(newName.trim())) {
      setAllOrderedForNames([...allOrderedForNames, newName.trim()]);
      setNewName('');
    }
  };

  const handleSaveEdit = (originalName: string) => {
    if (editedNameValue.trim() !== '' && !allOrderedForNames.includes(editedNameValue.trim())) {
      setAllOrderedForNames(allOrderedForNames.map(name => name === originalName ? editedNameValue.trim() : name));
      setEditingName(null);
      setEditedNameValue('');
    }
  };

  const handleDeleteName = (nameToDelete: string) => {
    setAllOrderedForNames(allOrderedForNames.filter(name => name !== nameToDelete));
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Ordered For Names</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row items-center">
            <Input
              type="text"
              placeholder="Add new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-grow mb-2 sm:mb-0 sm:mr-2"
            />
            <Button onClick={handleAddName} className="w-full sm:w-auto">Add Name</Button>
          </div>

          <h3 className="text-lg font-bold mb-2">Existing Names</h3>
          <ul className="border rounded p-2">
            {allOrderedForNames.length === 0 ? (
              <p className="text-gray-500">No names added yet.</p>
            ) : (
              allOrderedForNames.map((name) => (
                <li key={name} className="flex flex-col sm:flex-row justify-between items-center py-2 border-b last:border-b-0">
                  {editingName === name ? (
                    <>
                      <Input
                        type="text"
                        value={editedNameValue}
                        onChange={(e) => setEditedNameValue(e.target.value)}
                        className="flex-grow mb-2 sm:mb-0 sm:mr-2"
                      />
                      <div className="flex">
                        <Button size="sm" onClick={() => handleSaveEdit(name)}>Save</Button>
                        <Button variant="outline" size="sm" className="ml-2" onClick={() => {
                          setEditingName(null);
                          setEditedNameValue('');
                        }}>Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="mb-2 sm:mb-0 sm:mr-2">{name}</span>
                      <div className="flex">
                        <Button size="sm" onClick={() => {
                          setEditingName(name);
                          setEditedNameValue(name);
                        }}>Edit</Button>
                        <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteName(name)}>Delete</Button>
                      </div>
                    </>
                  )}
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageOrderedForNamesPage;
