import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../../styles/globals.css';
import { FaUser, FaFileAlt } from 'react-icons/fa'; // Import icons

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); // State untuk laporan yang dipilih
  const [progressMessage, setProgressMessage] = useState(''); // State untuk pesan sukses upload
  const [formData, setFormData] = useState({ 
    companyName: '', // Menambah state untuk Nama Perusahaan
    purchaseOrder: '', // Menambah state untuk Purchase Order
    workOrder:'',
    description: '', 
    file: null 
  }); // State untuk form upload
  const router = useRouter();

  // Fetch data laporan dari tabel visit_reports
  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await axios.get('/api/visit_reports'); // Sesuaikan endpoint API
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    }
    fetchReports();
  }, []);

  // Fetch data user
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/users'); // Sesuaikan endpoint API
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);

  // Fungsi untuk menangani klik pada laporan
  const handleReportClick = async (reportId) => {
    try {
      const response = await axios.get(`/api/visit_reports/${reportId}`);
      setSelectedReport(response.data); // Set detail laporan ke state
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    router.push('/login');
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  // Handle submit form for uploading material progress
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('companyName', formData.companyName); // Append Nama Perusahaan
    formDataObj.append('purchaseOrder', formData.purchaseOrder); // Append Purchase Order
    formDataObj.append('workOrder', formData.workOrder);
    formDataObj.append('description', formData.description);
    formDataObj.append('file', formData.file);
console.log(formDataObj);
    try {
      const response = await axios.post('/api/material-progress', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProgressMessage('Upload Success!');
      
      // Kosongkan form setelah upload berhasil
      setFormData({
        companyName: '',
        purchaseOrder: '',
        workOrder:'',
        description: '',
        file: null,
      });

      // Kosongkan input file manual karena input file tidak bisa dikontrol melalui state
      document.querySelector('input[type="file"]').value = '';
      
      
    } catch (error) {
      console.error('Error uploading material progress:', error.response.data);
    }
  };

  // Redirect ke halaman Data User
  const handleUserRedirect = () => {
    router.push('/admin/users'); // Mengarahkan ke halaman user
  };

  // Redirect ke halaman Data Laporan
  const handleReportRedirect = () => {
    router.push('/admin/reports'); // Mengarahkan ke halaman laporan
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center space-x-3"> {/* Container untuk logo dan teks */}
          {/* Tambahkan logo di sini */}
          <img 
            src="/ism.png" 
            alt="Logo" 
            className="w-8 h-8 lg:w-10 lg:h-10 object-contain" 
          />

          <div className="text-lg font-bold">ADMIN DASHBOARD</div>
          </div>
          <div>
            <button onClick={() => router.push('/admin/home')} className="bg-indigo-600 mr-4 hover:bg-indigo-500 p-2 rounded">Home</button>
            <button onClick={handleLogout}className="bg-indigo-600 mr-4 hover:bg-indigo-500 p-2 rounded">Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      style={{ backgroundImage: `url('/bg_web.png')` }}>
       {/* Kolom Cek Data User */}
        <div className="bg-yellow-300 p-6 rounded shadow cursor-pointer flex flex-col items-center justify-center" onClick={handleUserRedirect}>
          <h2 className="text-xl font-bold mb-4 flex flex-col items-center justify-center">
            <FaUser className="text-6xl mb-5" /> {/* Membuat ikon lebih besar dan menambahkan margin bawah */}
            Cek Data User
          </h2>
          <p>Klik untuk melihat data user</p>
        </div>

        {/* Kolom Cek Data Laporan */}
        <div className="bg-blue-500 p-6 rounded shadow cursor-pointer flex flex-col items-center justify-center" onClick={handleReportRedirect}>
          <h2 className="text-xl font-bold mb-4 flex flex-col items-center justify-center">
            <FaFileAlt className="text-6xl mb-5" /> {/* Membuat ikon lebih besar dan menambahkan margin bawah */}
            Cek Data Laporan
          </h2>
          <p>Klik untuk melihat data laporan</p>
        </div>

        {/* Kolom Upload Material Progress */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Upload Material Progress</h2>
          {progressMessage && <p className="text-green-500">{progressMessage}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="companyName"
              placeholder="Nama Perusahaan"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="purchaseOrder"
              placeholder="Purchase Order"
              value={formData.purchaseOrder}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="workOrder"
              placeholder="Work Order"
              value={formData.workOrder}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Deskripsi"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded w-full hover:bg-indigo-700"
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
