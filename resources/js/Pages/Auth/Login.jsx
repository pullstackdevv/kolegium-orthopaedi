import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, router } from '@inertiajs/react';
import { imageAsset } from '@/utils/asset';
import axios from 'axios';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors: validationErrors },
  } = useForm();

  const [serverErrors, setServerErrors] = useState([]);
  const [message, setMessage] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = async (data) => {
    setServerErrors([]);
    setMessage('');
    setMessageStatus('');
    try {
      // Use web login endpoint (session-based)
      const res = await axios.post('/cms/login', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      setMessage(res.data.message || 'Login berhasil!');
      setMessageStatus('success');
      
      // Redirect using Inertia router (better for SPA)
      setTimeout(() => {
        router.visit('/cms/dashboard');
      }, 1000);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || 'Login gagal');
        
        // Handle validation errors
        const errors = err.response.data.errors || {};
        const errorArray = Object.keys(errors).map(key => ({
          field: key,
          message: errors[key][0] || errors[key]
        }));
        setServerErrors(errorArray);
        setMessageStatus('error');
      } else {
        setMessage('Terjadi kesalahan koneksi');
        setMessageStatus('error');
      }
    }
  };

  const getServerError = (field) =>
    serverErrors.find((e) => e.field === field)?.message;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block text-white space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
                <Icon icon="solar:shield-check-bold" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Kolegium Orthopaedi</h1>
                <p className="text-blue-100 text-lg">Management System</p>
              </div>
            </div>
            <p className="text-xl text-blue-50 leading-relaxed">
              Sistem manajemen terintegrasi untuk Kolegium Orthopaedi Indonesia
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon icon="solar:user-check-rounded-bold" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">User Management</h3>
                <p className="text-blue-100 text-sm">Kelola pengguna dan hak akses dengan mudah</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon icon="solar:shield-user-bold" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Role & Permissions</h3>
                <p className="text-blue-100 text-sm">Sistem role-based access control yang fleksibel</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon icon="solar:lock-password-bold" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure Authentication</h3>
                <p className="text-blue-100 text-sm">Keamanan data dengan enkripsi tingkat enterprise</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 backdrop-blur-lg">
            {/* Mobile Logo & Title */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon icon="solar:shield-check-bold" className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Kolegium Orthopaedi</h1>
              <p className="text-gray-500 mt-1">Management System</p>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
              <p className="text-gray-500">Silakan login untuk melanjutkan</p>
            </div>
            {/* Alert Messages */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-in slide-in-from-top-2 ${
                  messageStatus === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                <Icon
                  icon={messageStatus === 'success' ? 'solar:check-circle-bold' : 'solar:danger-circle-bold'}
                  className="w-5 h-5 flex-shrink-0"
                />
                <span>{message}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="solar:letter-bold" className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email', { required: 'Email wajib diisi' })}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 focus:bg-white text-gray-700 placeholder-gray-400"
                    placeholder="nama@email.com"
                  />
                </div>
                {(validationErrors.email || getServerError('email')) && (
                  <div className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                    <span>{validationErrors.email?.message || getServerError('email')}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="solar:lock-password-bold" className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    {...register('password', { required: 'Password wajib diisi' })}
                    className="w-full pl-12 pr-14 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50 focus:bg-white text-gray-700 placeholder-gray-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
                    tabIndex={-1}
                  >
                    <Icon 
                      icon={showPwd ? 'solar:eye-bold' : 'solar:eye-closed-bold'} 
                      className="w-5 h-5" 
                    />
                  </button>
                </div>
                {(validationErrors.password || getServerError('password')) && (
                  <div className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <Icon icon="solar:danger-circle-bold" className="w-4 h-4" />
                    <span>{validationErrors.password?.message || getServerError('password')}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-8"
              >
                <span>Masuk ke Dashboard</span>
                <Icon icon="solar:arrow-right-bold" className="w-5 h-5" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>&copy; 2025 Kolegium Orthopaedi Indonesia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations - moved to app.css */}
    </div>
  );
}
