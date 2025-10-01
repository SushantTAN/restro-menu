import { Outlet } from 'react-router-dom';


const UserLayout = () => {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
};

export default UserLayout;
