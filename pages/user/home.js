import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../../styles/globals.css';

export default function HomeUser() {
  const [materialProgress, setMaterialProgress] = useState([]);
  const [searchPurchaseOrder, setSearchPurchaseOrder] = useState(''); // State untuk pencarian Purchase Order
  const [searchWorkOrder, setSearchWorkOrder] = useState(''); // State untuk pencarian Work Order
  const router = useRouter(); 

  // Fetch data material progress ketika halaman pertama kali di-load
  useEffect(() => {
    async function fetchMaterialProgress() {
      try {
        const response = await axios.get('/api/material-progress');
        setMaterialProgress(response.data);  // Menyimpan data ke state
      } catch (error) {
        console.error('Error fetching material progress:', error);
      }
    }

    fetchMaterialProgress();
  }, []);

  const handleLogout = () => {
    router.push('/login');
  };
// Fungsi untuk meng-handle perubahan pada input pencarian Purchase Order
const handlePurchaseOrderChange = (e) => {
  setSearchPurchaseOrder(e.target.value); // Update nilai pencarian Purchase Order
};

// Fungsi untuk meng-handle perubahan pada input pencarian Work Order
const handleWorkOrderChange = (e) => {
setSearchWorkOrder(e.target.value); // Update nilai pencarian Work Order
};

// Filter data berdasarkan purchase order dan work order
const filteredProgress = materialProgress.filter((progress) => 
  (progress.purchaseOrder && progress.purchaseOrder.toLowerCase().includes(searchPurchaseOrder.toLowerCase())) &&
  (progress.workOrder && progress.workOrder.toLowerCase().includes(searchWorkOrder.toLowerCase()))
);

  return (
    <div className="min-h-screen bg-blue">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/ism.png" 
              alt="Logo" 
              className="w-8 h-8 lg:w-10 lg:h-10 object-contain" 
            />
            <div className="text-lg font-bold">User Dashboard</div>
          </div>
          <div>
            <button
              onClick={() => router.push('/user/home')}
              className="mr-4 hover:bg-indigo-500 p-2 rounded"
            >
              Home
            </button>
            <button
              onClick={() => router.push('/user/dashboard')}
              className="mr-4 hover:bg-indigo-500 p-2 rounded"
            >
              Dashboard
            </button>
            <button onClick={handleLogout} className="hover:bg-indigo-500 p-2 rounded">
              Logout
            </button>
          </div>
        </div>
      </nav>

     {/* Search Bars */}
     <div className="container mx-auto py-2 flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:justify-center md:space-x-4">
        <input 
          type="text"
          placeholder="Search by Purchase Order"
          value={searchPurchaseOrder}
          onChange={handlePurchaseOrderChange}  // Fungsi ini akan terus di-trigger saat user mengetik
          className="border p-2 rounded-lg w-full md:w-1/3"
        />
        <input 
          type="text"
          placeholder="Search by Work Order"
          value={searchWorkOrder}
          onChange={handleWorkOrderChange}  // Fungsi ini akan terus di-trigger saat user mengetik
          className="border p-2 rounded-lg w-full md:w-1/3"
        />
      </div>    

      {/* Material Progress */}
      <div className="container mx-auto py-1"
      style={{ backgroundImage: `url('/bg_web.png')` }}>
        <h1 className="text-2xl font-bold mb-20">Material Progress</h1>
        <ul className="space-y-1">
          {filteredProgress.map((progress) => (
            <li 
              key={progress.id} 
              className="bg-white p-8 rounded-xl shadow-xl flex items-center space-x-8 w-full md:w-3/4 lg:w-2/3 xl:w-3/4 mx-auto"
            >
              {/* Gambar */}
              {progress.file && (
                <div className="w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0">
                  <img 
                    src={`/uploads/${progress.file}`} 
                    alt="Material" 
                    className="w-full h-full object-cover rounded-lg shadow-  hover:scale-110 transition-transform duration-300 ease-in-out"
                  />
                </div>
              )}

              {/* Deskripsi menggunakan tabel */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="text-left px-4 py-3">Field</th>
                      <th className="text-left px-4 py-3">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-bold text-gray-900">Nama Perusahaan</td>
                      <td className="px-4 py-3 text-gray-700">{progress.companyName}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-bold text-gray-900">Purchase Order</td>
                      <td className="px-4 py-3 text-gray-700">{progress.purchaseOrder}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-bold text-gray-900">Work Order</td>
                      <td className="px-4 py-3 text-gray-700">{progress.workOrder}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-bold text-gray-900">Deskripsi </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-normal">
                        {progress.description}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
