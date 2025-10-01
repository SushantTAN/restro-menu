import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils"; // adjust the import based on where your cn() helper lives

const AdminSidebar = () => {
  const [, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Restaurants", path: "/admin/restaurants" },
    { name: "Orders", path: "/admin/orders" },

    // add more links here
  ];

  return (
    <div className="px-4">
      <nav className="mt-2">
        <ul className="flex gap-6 flex-nowrap overflow-x-auto">
          {links.map((link) => {
            const isActive =
              location.pathname === link.path ||
              location.pathname.startsWith(link.path + "/"); // supports subroutes

            return (
              <li key={link.path} className="mb-4">
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block text-lg relative pb-1 transition",
                    isActive
                      ? "font-semibold text-gray-700 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gray-700"
                      : "text-gray-600 hover:text-gray-300"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
