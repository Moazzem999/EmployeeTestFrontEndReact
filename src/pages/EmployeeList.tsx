import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '@/services/employeeService';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Mail,
  Phone,
  DollarSign,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Modal from '@/components/Modal';
import { cn } from '@/utils/cn';

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees', searchTerm],
    queryFn: () => employeeService.getAll(searchTerm),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeleteId(null);
    }
  });

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Employees</h1>
          <p className="text-slate-500">Manage and oversee your organization's staff members.</p>
        </div>
        <button 
          onClick={() => navigate('/employees/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
        >
          <Plus size={20} />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Salary</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-6 px-6"><div className="h-10 w-40 bg-slate-100 rounded-lg" /></td>
                    <td className="py-6 px-6 hidden md:table-cell"><div className="h-4 w-32 bg-slate-100 rounded" /></td>
                    <td className="py-6 px-6"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                    <td className="py-6 px-6"><div className="h-8 w-8 bg-slate-100 rounded-full ml-auto" /></td>
                  </tr>
                ))
              ) : employees?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <Search size={48} strokeWidth={1.5} />
                      <p className="font-medium text-lg">No employees found matching "{searchTerm}"</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees?.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-500">ID: #{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Mail size={12} /> {emp.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Phone size={12} /> {emp.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                        <DollarSign size={12} /> {emp.salary.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/employees/edit/${emp.id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setDeleteId(emp.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="lg:hidden">
                        <button className="p-2 text-slate-400">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={deleteId !== null} 
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-slate-600">Are you sure you want to delete this employee? This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => setDeleteId(null)}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
            >
              {deleteMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeList;
