const pool = require('../config/db');

async function getApplicationsByUser(userId) {
  const res = await pool.query(
    'SELECT * FROM applications WHERE user_id = $1 ORDER BY date_applied DESC',
    [userId]
  );
  return res.rows;
}

async function getApplicationById(id, userId) {
  const res = await pool.query(
    'SELECT * FROM applications WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return res.rows[0];
}

async function createApplication(application) {
  const { user_id, company, position, date_applied, status, notes } = application;
  const res = await pool.query(
    `INSERT INTO applications (user_id, company, position, date_applied, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user_id, company, position, date_applied, status, notes]
  );
  return res.rows[0];
}

async function updateApplication(id, userId, application) {
  const { company, position, date_applied, status, notes } = application;
  const res = await pool.query(
    `UPDATE applications SET company=$1, position=$2, date_applied=$3, status=$4, notes=$5
     WHERE id=$6 AND user_id=$7 RETURNING *`,
    [company, position, date_applied, status, notes, id, userId]
  );
  return res.rows[0];
}

async function deleteApplication(id, userId) {
  await pool.query('DELETE FROM applications WHERE id=$1 AND user_id=$2', [id, userId]);
}

module.exports = {
  getApplicationsByUser,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
};
