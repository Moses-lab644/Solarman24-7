const db = require("./db");

// GET SESSION
const getSession = async (phone) => {
  const res = await db.query(
    "SELECT * FROM sessions WHERE phone = $1",
    [phone]
  );

  if (res.rows.length > 0) return res.rows[0];

  const created = await db.query(
    "INSERT INTO sessions (phone, step) VALUES ($1, 'MENU') RETURNING *",
    [phone]
  );

  return created.rows[0];
};

// UPDATE SESSION
const updateSession = async (phone, step) => {
  await db.query(
    `INSERT INTO sessions (phone, step)
     VALUES ($1, $2)
     ON CONFLICT (phone)
     DO UPDATE SET step = $2, updated_at = NOW()`,
    [phone, step]
  );
};

// RESET SESSION
const resetSession = async (phone) => {
  await updateSession(phone, "MENU");
};

module.exports = {
  getSession,
  updateSession,
  resetSession
};