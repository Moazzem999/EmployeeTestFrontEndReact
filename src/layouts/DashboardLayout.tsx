import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  User
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const SidebarItem = ({ to, icon: Icon, label, isActive }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      isActive 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    <Icon size={20} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
    <span className="font-medium">{label}</span>
    {isActive && <ChevronRight size={16} className="ml-auto" />}
  </Link>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/employees', icon: Users, label: 'Employees' },
  ];

  return (
    <div className="min-height-screen bg-slate-50 flex">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 lg:translate-x-0 shadow-xl lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Users size={24} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">StaffSync</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.to}
                {...item}
                isActive={location.pathname === item.to}
              />
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800">{username}</span>
              <span className="text-xs text-slate-500 font-medium capitalize">Administrator</span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Page Container */}
        <div className="p-4 lg:p-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
