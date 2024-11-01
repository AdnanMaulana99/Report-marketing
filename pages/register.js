import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // Menggunakan useRouter untuk redirect
import Image from 'next/image'; // Menggunakan Image dari Next.js untuk pengoptimalan gambar

import '../styles/globals.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState(''); // State untuk menyimpan pesan error
  const [message, setMessage] = useState(''); // State untuk menyimpan pesan sukses
  const router = useRouter(); // Inisialisasi useRouter

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', formData);
      setMessage('Register Success!'); // Menampilkan pesan sukses
      setError(''); // Mengosongkan pesan error

      // Redirect ke halaman login setelah sukses
      setTimeout(() => {
        router.push('/login'); // Mengarahkan ke halaman login
      }, 2000); // Redirect setelah 2 detik
      
    } catch (error) {
      if (error.response && error.response.data.message === 'User already exists') {
        setError('Akun sudah terdaftar!'); // Menampilkan pesan akun sudah ada
      } else {
        setError('Error registering user. Please try again.');
      }
      setMessage(''); // Mengosongkan pesan sukses
    }
  };

  return (
    <div className="min-h-screen bg-gray-10 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          {/* Menambahkan gambar logo */}
          <Image src="/ism.png" alt="Logo" width={100} height={100} />
        </div>
        <h1 className="text-2xl text-center font-serif ml-50">Registrasi Akun</h1>

        {error && <p className="text-red-500 text-center">{error}</p>} {/* Menampilkan pesan error */}
        {message && <p className="text-green-500 text-center">{message}</p>} {/* Menampilkan pesan sukses */}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-purple-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-purple-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-purple-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
