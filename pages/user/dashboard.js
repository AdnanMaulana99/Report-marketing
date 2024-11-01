import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../../styles/globals.css';

export default function UserDashboard() {
  const router = useRouter();

  // Inisialisasi state formData dengan nilai kosong untuk setiap field
  const [formData, setFormData] = useState({
    marketing_name:'',
    company_name: '',
    pic_name: '',
    company_address: '',
    visit_date: '',
    in_time: '',
    out_time: '',
    purpose: '',
    description: '',
    company_image: '',
    customer_image: null,
  });

  const [materialProgress, setMaterialProgress] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');  // State untuk pesan error

  const handleLogout = () => {
    router.push('/login'); // Mengarahkan pengguna ke halaman login
  };

  // Fungsi validasi untuk memeriksa apakah semua field terisi
  const validateForm = () => {
    const {
      marketing_name,
      company_name,
      pic_name,
      company_address,
      visit_date,
      in_time,
      out_time,
      purpose,
      description,
    } = formData;

    // Validasi apakah ada field yang kosong
    if (
      !marketing_name ||
      !company_name ||
      !pic_name ||
      !company_address ||
      !visit_date ||
      !in_time ||
      !out_time ||
      !purpose ||
      !description
    ) {
      setErrorMessage('lengkapi Laporan Anda.');
      return false;
    }

    setErrorMessage(''); // Hapus pesan error jika validasi berhasil
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lakukan validasi form
    if (!validateForm()) {
      return; // Jika validasi gagal, hentikan pengiriman form
    }

    const formDataToSend = new FormData();

    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post('/api/visit_reports', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Tentukan tipe konten
        },
      });

      alert('Report submitted successfully');

      // Mengatur ulang form setelah submit sukses
      setFormData({
        marketing_name:'',
        company_name: '',
        pic_name: '',
        company_address: '',
        visit_date: '',
        in_time: '',
        out_time: '',
        purpose: '',
        description: '',
        company_image: '',
        customer_image: null,
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report');
    }
  };

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await axios.get('/api/material-progress');
        setMaterialProgress(res.data);
      } catch (error) {
        console.error('Error fetching material progress:', error);
      }
    }
    fetchProgress();
  }, []);

  return (
    <div className="min-h-screen bg-white">
    {/* Navbar */}
    <nav className="bg-indigo-600 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between">
        <div className="flex items-center space-x-3"> {/* Container untuk logo dan teks */}
          {/* Tambahkan logo di sini */}
          <img 
            src="/ism.png" 
            alt="Logo" 
            className="w-8 h-8 lg:w-10 lg:h-10 object-contain" 
          />
          
          <div className="text-lg font-bold">Marketing Report</div>
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

      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Submit Visit Report</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-2 rounded">
              {errorMessage}
            </div>
          )}
           {/* Company Name */}
           <div>
            <label className="block text-lg font-medium">Nama Marketing</label>
            <input
              type="text"
              placeholder="Marketing Name"
              value={formData.marketing_name}
              onChange={(e) => setFormData({ ...formData, marketing_name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-lg font-medium">Nama Perusahaan</label>
            <input
              type="text"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* PIC Name */}
          <div>
            <label className="block text-lg font-medium">Nama PIC</label>
            <input
              type="text"
              placeholder="PIC Name"
              value={formData.pic_name}
              onChange={(e) => setFormData({ ...formData, pic_name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-lg font-medium">Alamat Perusahaan</label>
            <input
              type="text"
              placeholder="Alamat Perusahaan"
              value={formData.company_address}
              onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Visit Date */}
          <div>
            <label className="block text-lg font-medium">Tanggal Visit</label>
            <input
              type="date"
              value={formData.visit_date}
              onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* In Time */}
          <div>
            <label className="block text-lg font-medium mb-1">Waktu Masuk</label>
            <input
              type="time"
              value={formData.in_time}
              onChange={(e) => setFormData({ ...formData, in_time: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Out Time */}
          <div>
            <label className="block text-lg font-medium mb-1">Waktu Keluar</label>
            <input
              type="time"
              value={formData.out_time}
              onChange={(e) => setFormData({ ...formData, out_time: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-lg font-medium">Purpose Project</label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Select Purpose</option>
              <option value="Project Baru">Project Baru</option>
              <option value="Negosiasi Harga">Negosiasi Harga</option>
              <option value="Invoice Faktur">Invoice Faktur</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-medium">Deskripsi Hasil Kunjungan</label>
            <textarea
              placeholder="Deskripsi hasil kunjungan"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

        {/* Company Image */}
        
        <div>
          <label className="block text-lg font-medium">Bukti visit</label>
          <input
          type="file"onChange={(e) => setFormData({ ...formData, company_image: e.target.files[0] })}  
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>



          <div>
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded w-full hover:bg-indigo-700">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
