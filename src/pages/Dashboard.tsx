import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import { Users, DollarSign, Briefcase, TrendingUp, UserPlus, Search } from 'lucide-react';
import { cn } from '@/utils/cn';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getAll()
  });

  const stats = [
    { 
      title: 'Total Employees', 
      value: isLoading ? '...' : employees?.length || 0, 
      icon: Users, 
      color: 'bg-blue-600',
      trend: '+4%'
    },
    { 
      title: 'Active Roles', 
      value: isLoading ? '...' : Math.floor((employees?.length || 0) * 0.9), 
      icon: Briefcase, 
      color: 'bg-indigo-600',
      trend: '+2%'
    },
    { 
      title: 'Total Payroll', 
      value: isLoading ? '...' : `$${(employees?.reduce((acc, emp) => acc + emp.salary, 0) || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-emerald-600',
      trend: '+12%'
    },
    { 
      title: 'Monthly Hiring', 
      value: '8', 
      icon: UserPlus, 
      color: 'bg-amber-600'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening with your staff today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</button>
          </div>
          
          <div className="space-y-6">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              employees?.slice(0, 5).map((emp) => (
                <div key={emp.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{emp.name}</p>
                    <p className="text-xs text-slate-500">Position updated to Senior Developer</p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-slate-400">2h ago</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Upgrade System</h3>
            <p className="text-blue-100 text-sm mb-6 opacity-80">Get access to premium HR reports and automated payroll tracking.</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-50 transition-colors">
              Go Pro
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
