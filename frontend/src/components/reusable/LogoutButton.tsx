import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';

import { RxExit } from "react-icons/rx";

const LogoutButton: React.FC = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to a common login page or home page
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 ">
      <Button onClick={handleLogout} variant="destructive" className='rounded-full h-10 w-10 shadow-xl border border-white'>
        <RxExit />
      </Button>
    </div>
  );
};

export default LogoutButton;
