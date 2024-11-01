import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import db from '../../lib/db';

// Nonaktifkan bodyParser bawaan Next.js karena kita akan menggunakan formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Logika untuk mendapatkan data laporan (GET)
    try {
      const [reports] = await db.query('SELECT * FROM visit_reports'); // Query untuk mendapatkan data laporan
      res.status(200).json(reports); // Kirim data laporan sebagai respons
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  } else if (req.method === 'POST') {
    // Logika untuk upload laporan baru (POST)
    const form = new IncomingForm();

    // Tentukan direktori penyimpanan untuk file gambar
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Pastikan folder upload ada, jika tidak, buat foldernya
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.uploadDir = uploadDir; // Set direktori penyimpanan

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form' });
      }

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
      } = fields;

      // Validasi apakah semua field ada
      if (!marketing_name || !company_name || !pic_name || !company_address || !visit_date || !in_time || !out_time || !purpose || !description) {
        return res.status(400).json({ error: "Please fill in all required fields." });
      }

      // Proses file gambar
      let companyImageName = null;
      if (files.company_image) {
        const file = files.company_image[0]; // Dapatkan file pertama jika ada banyak file
        const fileName = `${Date.now()}_${file.originalFilename}`; // Buat nama file yang unik
        const filePath = path.join(uploadDir, fileName);

        // Pindahkan file ke direktori yang diinginkan
        fs.renameSync(file.filepath, filePath); 

        companyImageName = fileName; // Simpan hanya nama file ke dalam database
      }

      try {
        // Simpan data laporan ke dalam database, termasuk nama file gambar
        const query = `
          INSERT INTO visit_reports 
          (marketing_name, company_name, pic_name, company_address, visit_date, in_time, out_time, purpose, description, company_image)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.query(query, [
          marketing_name,
          company_name,
          pic_name,
          company_address,
          visit_date,
          in_time,
          out_time,
          purpose,
          description,
          companyImageName, // Simpan nama file gambar saja
        ]);

        res.status(201).json({ message: 'Report submitted successfully' });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Error submitting report' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
