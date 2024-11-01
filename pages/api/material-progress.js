import pool from '../../lib/db';
import multer from 'multer';
import { default as nextConnect } from 'next-connect';
import path from 'path';
import fs from 'fs';

// Setup penyimpanan dengan multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = './public/uploads';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Batas ukuran file 10MB
});

// Buat handler dengan nextConnect
const handler = nextConnect();

// Middleware untuk menghandle upload file
handler.use(upload.single('file'));

// Endpoint POST untuk menyimpan material progress
handler.post(async (req, res) => {
  try {
    // Mengambil data dari req.body
    const { description, companyName, purchaseOrder, workOrder } = req.body; // Menangkap `companyName` dan `purchaseOrder`
    const file = req.file ? req.file.filename : null; // Menyimpan nama file

    // Validasi input: Pastikan semua field yang diperlukan ada
    if (!description || !companyName || !purchaseOrder || !workOrder) {
      return res.status(400).json({ message: 'Description, Company Name, and Purchase Order Work Order are required.' });
    }

    // Simpan data ke database
    const result = await pool.query(
      'INSERT INTO material_progress (description, companyName, purchaseOrder, workOrder, file) VALUES (?, ?, ?, ?, ?)',
      [description, companyName, purchaseOrder, workOrder, file]
    );
    
    // Kirim response sukses dengan data yang disimpan
    return res.status(201).json({ 
      id: result.insertId, 
      description, 
      companyName, 
      purchaseOrder,
      workOrder, 
      file 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error saving material progress.' });
  }
});

// Mengatasi request GET untuk mengambil semua material progress
handler.get(async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM material_progress'); // Mengambil data dari tabel
    console.log(rows);
    return res.status(200).json(rows); // Mengirimkan data ke frontend
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Error fetching material progress.' });
  }
});

// Nonaktifkan bodyParser Next.js untuk menggunakan multer
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
