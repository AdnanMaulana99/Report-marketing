import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaHome } from 'react-icons/fa'; // Import ikon
import { useRouter } from 'next/router'; // Import useRouter

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const router = useRouter(); // Inisialisasi router

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-bold flex items-center">
            <FaUser className="mr-2" /> DATA USER
          </div>
          <div>
            <button
              onClick={() => router.push('/admin/home')} // Perbaikan router.push
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded inline-flex items-center"
            >
              <FaHome className="mr-2" /> Kembali ke Home
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Password</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 flex items-center">
                    <FaUser className="mr-2" /> {user.username}
                  </td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.password}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-10 py-5 text-center" colSpan="10">
                  Klik di sini untuk menampilkan data users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

