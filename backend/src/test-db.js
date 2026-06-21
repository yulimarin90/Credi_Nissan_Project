const { pool } = require("./config/Database");

async function testConnection() {
  try {
    const connection = await pool.connect();

    const result = await connection
      .request()
      .query("SELECT DB_NAME() AS BaseDatos");

    console.log(result.recordset);

    process.exit(0);

  } catch (error) {
    console.error("ERROR:", error);

    process.exit(1);
  }
}

testConnection();