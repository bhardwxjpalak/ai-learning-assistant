import { NavLink } from "react-router-dom";
import {
  House,
  Upload,
  MessageSquare,
  BookOpen,
} from "lucide-react";

const menuItems = [
  {
    title: "Home",
    path: "/",
    icon: House,
  },
  {
    title: "Upload",
    path: "/upload",
    icon: Upload,
  },
  {
    title: "Chat",
    path: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Knowledge Base",
    path: "/knowledge-base",
    icon: BookOpen,
  },
];

function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}

      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        AI Learning
      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg mb-2 transition ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />

              {item.title}
            </NavLink>
          );
        })}

      </nav>

    </aside>
  );
}

export default Sidebar;