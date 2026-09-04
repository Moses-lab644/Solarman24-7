const db = require("./db");

// GET USER OR CREATE
const getUser = async (phone) => {
  const user = await db.query(
    "SELECT * FROM users WHERE phone = $1",
    [phone]
  );

  if (user.rows.length > 0) return user.rows[0];

  const newUser = await db.query(
    "INSERT INTO users (phone) VALUES ($1) RETURNING *",
    [phone]
  );

  return newUser.rows[0];
};

// UPDATE PLAN
const updateUserPlan = async (phone, plan, expiresAt = null) => {
  await db.query(
    "UPDATE users SET plan = $1, expires_at = $2 WHERE phone = $3",
    [plan, expiresAt, phone]
  );
};

// CHECK ACCESS
const hasAccess = async (phone) => {
  const user = await getUser(phone);

  if (user.plan === "lifetime") return true;

  if (user.plan === "monthly") {
    return user.expires_at && user.expires_at > Date.now();
  }

  return false;
};

module.exports = {
  getUser,
  updateUserPlan,
  hasAccess
};