import { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  const [, setIsOpen] = useState(false);


  return (
    <div className={"px-4"}>
      <nav className="mt-2">
        <ul className='flex gap-6 flex-nowrap overflow-x-auto'>
          <li className="mb-4">
            <Link to="/admin/dashboard" className="block text-lg hover:text-gray-300" onClick={() => setIsOpen(false)}>Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/restaurants" className="block text-lg hover:text-gray-300" onClick={() => setIsOpen(false)}>Restaurants</Link>
          </li>
          {/* Add more admin links here as needed */}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
