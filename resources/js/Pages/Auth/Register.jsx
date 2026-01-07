import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';
import { Alert } from 'flowbite-react';
import { AuthAPI } from '@/api'

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: validationErrors },
  } = useForm();

  const [showPwd, setShowPwd] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const onSubmit = async (data) => {
    setServerErrors([]);
    setMessage('');
    setIsLoadingSubmit(true);

    try {
      const res = await AuthAPI.register(data)

      setMessage(res.data.message || 'Registration successful!');
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || 'Registration failed');
        setServerErrors(err.response.data.errors || []);
      }
    }
  };

  const getServerError = (field) =>
    serverErrors.find((e) => e.field === field)?.message;

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Member Registration</h2>
      {message && <Alert color="failure" className="mb-4">{message}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Full name is required' })}
            className="w-full border px-3 py-2 rounded pr-10"
            color={validationErrors.name || getServerError('name') ? 'failure' : undefined}
          />
          {(validationErrors.name || getServerError('name')) && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.name?.message || getServerError('name')}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full border px-3 py-2 rounded pr-10"
            color={validationErrors.email || getServerError('email') ? 'failure' : undefined}
          />
          {(validationErrors.email || getServerError('email')) && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.email?.message || getServerError('email')}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPwd ? 'text' : 'password'}
              {...register('password', { required: 'Password is required', minLength: 6 })}
              className="w-full border px-3 py-2 rounded pr-10"
              color={validationErrors.password || getServerError('password') ? 'failure' : undefined}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 text-gray-500"
              onClick={() => setShowPwd(!showPwd)}
              tabIndex={-1}
            >
              <Icon icon={showPwd ? 'fluent:eye-off-16-regular' : 'fluent:eye-16-regular'} className="w-5 h-5" />
            </button>
          </div>
          {(validationErrors.password || getServerError('password')) && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.password?.message || getServerError('password')}
            </p>
          )}
        </div>

        {/* Password Confirmation */}
        <div>
          <label htmlFor="password_confirmation" className="block mb-1 text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            className="w-full border px-3 py-2 rounded pr-10"
            {...register('password_confirmation', {
              required: 'Password confirmation is required',
              validate: (value) =>
                value === watch('password') || 'Passwords do not match',
            })}
            color={validationErrors.password_confirmation ? 'failure' : undefined}
          />
          {validationErrors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.password_confirmation.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoadingSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>

        <p className="text-center text-sm mt-2">
          Already have an account?{' '}
          <Link href={route('auth.login')} className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
