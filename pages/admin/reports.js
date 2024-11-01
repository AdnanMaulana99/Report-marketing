import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileAlt, FaHome, FaPrint, FaUndo } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/router';

export default function ReportsPage() {
  const [originalReports, setOriginalReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [marketingName, setMarketingName] = useState(''); // New state for marketing name filter
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await axios.get('/api/visit_reports');
        setOriginalReports(response.data);
        setFilteredReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    }

    fetchReports();
  }, []);

  const filterReports = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filtered = originalReports.filter((report) => {
        const visitDate = new Date(report.visit_date);
        const matchesDate = (!start || visitDate >= start) && (!end || visitDate <= end);
        // Check if marketing_name exists before calling toLowerCase
        const matchesMarketingName = marketingName
            ? report.marketing_name && report.marketing_name.toLowerCase().includes(marketingName.toLowerCase())
            : true;

        return matchesDate && matchesMarketingName;
    });

    if (filtered.length === 0) {
        alert('Tidak ada laporan yang ditemukan untuk filter ini. Menampilkan data sebelumnya.');
        setFilteredReports(originalReports);
    } else {
        setFilteredReports(filtered);
    }
};


  const resetFilter = () => {
    setFilteredReports(originalReports);
    setStartDate('');
    setEndDate('');
    setMarketingName(''); // Reset marketing name filter
  };

  const handlePrint = () => {
    if (filteredReports.length === 0) {
      alert('Tidak ada laporan yang tersedia untuk dicetak.');
      return;
    }

    const input = document.getElementById('report-table');

    setTimeout(() => {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('report.pdf');
      });
    }, 1000);
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center text-white">
            <FaFileAlt className="mr-3 text-white" /> Data Laporan
          </h1>
          <div className="flex space-x-4">
            <button onClick={handlePrint} className="flex items-center hover:bg-indigo-700 px-3 py-2 rounded">
              <FaPrint className="mr-2" /> Cetak Laporan Bulanan
            </button>
            <button onClick={() => router.push('/admin/home')} className="bg-indigo-600 flex items-center hover:bg-indigo-700 px-3 py-2 rounded">
              <FaHome className="bg-indigo-600 mr-2" /> Kembali ke Home
            </button>
          </div>
        </div>
      </nav>

      <div className="p-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Pilih Filter:</label>
          <div className="flex space-x-4 mt-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded-md shadow-sm"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded-md shadow-sm"
            />
            <input
              type="text"
              value={marketingName}
              onChange={(e) => setMarketingName(e.target.value)}
              placeholder="Nama Marketing"
              className="border px-3 py-2 rounded-md shadow-sm"
            />
            <button onClick={filterReports} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Terapkan Filter</button>
            <button onClick={resetFilter} className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center">
              <FaUndo className="mr-2" /> Reset Filter
            </button>
          </div>
        </div>

        <table id="report-table" className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-4 text-left text-lg font-semibold">Nama Marketing</th>
              <th className="px-4 py-4 text-left text-lg font-semibold">Nama Perusahaan</th>
              <th className="px-4 py-4 text-left text-lg font-semibold">Nama PIC</th>
              <th className="px-4 py-4 text-left text-lg font-semibold">Alamat Perusahaan</th>
              <th className="px-4 py-4 text-left text-lg font-semibold">Tanggal Kunjungan</th>
              <th className="px-4 py-4 text-left text-lg font-semibold">Waktu Masuk</th>
              <th className="px-4 py-4 text-left text-lg font-semibold">Waktu Keluar</th>
              <th className="px-4 py-4 text-left text-lg font-semibold">Tujuan</th>
              <th className="px-4 py-4 text-left text-lg font-semibold">Deskripsi</th>
              <th className="px-4 py-4 text-left text-lg font-semibold">Foto Perusahaan</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-100 transition duration-200">
                  <td className="px-4 py-3">{report.marketing_name}</td>
                  <td className="px-4 py-3">{report.company_name}</td>
                  <td className="px-4 py-3">{report.pic_name}</td>
                  <td className="px-4 py-3">{report.company_address}</td>
                  <td className="px-4 py-3">{report.visit_date}</td>
                  <td className="px-4 py-3">{report.in_time}</td>
                  <td className="px-4 py-3">{report.out_time}</td>
                  <td className="px-4 py-3">{report.purpose}</td>
                  <td className="px-4 py-3">{report.description}</td>
                  <td className="px-4 py-3">
                    <img
                      src={report.company_image ? `/uploads/${report.company_image}` : '/bg.jpg'}
                      alt="Company_Image"
                      className="w-20 h-20 object-cover rounded-md border cursor-pointer"
                      onClick={() => handleImageClick(report.company_image ? `/uploads/${report.company_image}` : '/bg.jpg')}
                      onError={(e) => {
                        e.target.src = '/start.jpg';
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-center" colSpan="10">Tidak ada laporan tersedia</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img src={selectedImage} alt="Modal Image" className="max-w-full max-h-full rounded-lg shadow-lg" />
            <button onClick={closeModal} className="absolute top-0 right-0 p-2 text-white text-2xl font-bold">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}
