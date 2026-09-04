const pool = require("./db");

const migrate = async () => {

  try {

    // USERS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(30) UNIQUE NOT NULL,
        access BOOLEAN DEFAULT false,
        plan VARCHAR(50) DEFAULT 'FREE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // SESSIONS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(30) UNIQUE NOT NULL,
        step VARCHAR(100) DEFAULT 'MENU',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("🟢 Database migrated successfully");

    process.exit();

  } catch (error) {

    console.log(
      "🔴 Migration error:",
      error.message
    );

    process.exit();
  }
};

migrate();