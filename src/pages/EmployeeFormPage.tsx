import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/employeeService';
import { 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  ArrowLeft, 
  Save, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';

const employeeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  salary: z.coerce.number().min(0, "Salary cannot be negative"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const EmployeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const { data: employee, isLoading: isFetching } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getById(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        salary: employee.salary,
      });
    }
  }, [employee, reset]);

  const mutation = useMutation({
    mutationFn: (data: EmployeeFormData) => 
      isEdit ? employeeService.update(Number(id), data) : employeeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    }
  });

  const onSubmit = (data: EmployeeFormData) => {
    mutation.mutate(data);
  };

  if (isEdit && isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <Loader2 size={40} className="animate-spin text-blue-600" />
        <p className="font-medium">Loading employee details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/employees')}
          className="p-2 hover:bg-white rounded-xl text-slate-500 hover:text-slate-800 transition-all border border-transparent hover:border-slate-200"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEdit ? 'Edit Employee' : 'New Employee'}
          </h1>
          <p className="text-slate-500">Fill in the details below to {isEdit ? 'update' : 'add'} a staff member.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative group">
              <User size={18} className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.name ? "text-red-400" : "text-slate-400 group-focus-within:text-blue-500")} />
              <input 
                {...register("name")}
                className={cn(
                  "w-full bg-slate-50 border pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm",
                  errors.name ? "border-red-200 focus:border-red-500" : "border-slate-200 focus:border-blue-500/50"
                )}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail size={18} className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.email ? "text-red-400" : "text-slate-400 group-focus-within:text-blue-500")} />
              <input 
                {...register("email")}
                className={cn(
                  "w-full bg-slate-50 border pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm",
                  errors.email ? "border-red-200 focus:border-red-500" : "border-slate-200 focus:border-blue-500/50"
                )}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email.message}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
            <div className="relative group">
              <Phone size={18} className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.phone ? "text-red-400" : "text-slate-400 group-focus-within:text-blue-500")} />
              <input 
                {...register("phone")}
                className={cn(
                  "w-full bg-slate-50 border pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm",
                  errors.phone ? "border-red-200 focus:border-red-500" : "border-slate-200 focus:border-blue-500/50"
                )}
                placeholder="+1 234 567 890"
              />
            </div>
            {errors.phone && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.phone.message}</p>}
          </div>

          {/* Salary Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Annual Salary</label>
            <div className="relative group">
              <DollarSign size={18} className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", errors.salary ? "text-red-400" : "text-slate-400 group-focus-within:text-blue-500")} />
              <input 
                type="number"
                {...register("salary")}
                className={cn(
                  "w-full bg-slate-50 border pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm",
                  errors.salary ? "border-red-200 focus:border-red-500" : "border-slate-200 focus:border-blue-500/50"
                )}
                placeholder="50000"
              />
            </div>
            {errors.salary && <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.salary.message}</p>}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
          <button 
            type="button"
            onClick={() => navigate('/employees')}
            className="px-8 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
          >
            Discard
          </button>
          <button 
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            {mutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isEdit ? 'Update Employee' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFormPage;
