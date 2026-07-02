const { pool, poolConnect } = require("./config/database");

async function testConnection() {
  try {

    await poolConnect;

    const result = await pool
      .request()
      .query("SELECT DB_NAME() AS BaseDatos");

    console.log(result.recordset);

  } catch (error) {

    console.error("ERROR:", error);

  } finally {

    await pool.close();

  }
}

testConnection();