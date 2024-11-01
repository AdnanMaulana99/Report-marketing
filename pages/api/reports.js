import db from '../../lib/db';

export default async function handler(req, res) {
  try {
    const reports = await db.query(`SELECT * FROM visit_reports`);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reports' });
  }
}
