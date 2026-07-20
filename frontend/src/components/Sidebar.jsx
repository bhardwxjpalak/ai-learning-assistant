import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Upload,
  Sparkles,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "AI Workspace",
    path: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Knowledge Repository",
    path: "/knowledge-base",
    icon: BookOpen,
  },
  {
    title: "Upload Assets",
    path: "/upload",
    icon: Upload,
  },
];

function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-slate-950 text-white flex flex-col border-r border-slate-800">

      {/* Brand */}

      <div className="px-6 py-8 border-b border-slate-800">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-xl font-bold">
            KH
          </div>

          <div>

            <h2 className="text-lg font-bold">
              Kortex AI
            </h2>

            <p className="text-xs text-slate-400">
              Enterprise Platform
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl mb-3 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>

            </NavLink>

          );
        })}

      </nav>

      {/* Footer */}

      <div className="p-5 border-t border-slate-800">

        <div className="flex items-center gap-3">

          <Sparkles size={18} className="text-blue-400" />

          <div>

            <p className="text-sm font-medium">
              AI Powered
            </p>

            <p className="text-xs text-slate-400">
              Enterprise Edition
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;