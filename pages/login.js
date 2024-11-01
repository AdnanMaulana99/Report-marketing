import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import '../styles/globals.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', { email, password });

      const userRole = response.data.role;

      if (userRole === 'admin') {
        router.push('/admin/home');
      } else if (userRole === 'user') {
        router.push('/user/home');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error during login');
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  // Fungsi untuk redirect ke halaman lupa password
  const handleResetPasswordRedirect = () => {
    router.push('/reset-password'); // Redirect ke halaman lupa password
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-6">
          <Image src="/ism.png" alt="Logo" width={100} height={100} />
        </div>
        <h1 className="text-2xl font-serif text-center text-indigo-500">PT.INDOSEIKI SUKSES MANDIRI</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        <p className="text-sm text-center text-gray-500">
          Lupa password?{' '}
          <span
            className="font-medium text-indigo-600 hover:underline cursor-pointer"
            onClick={handleResetPasswordRedirect}
          >
            Reset password
          </span>
        </p>
        <p className="text-sm text-center text-gray-500">
          Belum punya akun?{' '}
          <span
            className="font-medium text-indigo-600 hover:underline cursor-pointer"
            onClick={handleRegisterRedirect}
          >
            Daftar sekarang
          </span>
        </p>
      </div>
    </div>
  );
}
