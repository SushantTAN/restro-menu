import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="">
      <AdminSidebar />
      <div className="flex-1 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
