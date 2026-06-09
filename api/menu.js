const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query(`CREATE TABLE IF NOT EXISTS menu_items (id SERIAL PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL, description TEXT, image TEXT)`);

      const { rows: c } = await client.query("SELECT COUNT(*)::int as c FROM menu_items");
      if (c[0].c === 0) {
        const items = [
          ["CIWENG", 10000, "Camilan berbahan dasar aci yang gurih dan renyah.", "src/ciweng.jpeg"],
          ["MOLACHEE", 10000, "Makanan ringan dengan cita rasa khas dan tekstur kenyal yang lezat.", "src/molachee.jpeg"],
          ["CILUKBA", 10000, "Camilan gurih dengan tekstur renyah di luar dan lembut di dalam.", "src/cilukba.jpeg"]
        ];
        for (const m of items) {
          await client.query("INSERT INTO menu_items (name, price, description, image) VALUES ($1,$2,$3,$4)", m);
        }
      }

      const { rows } = await client.query("SELECT * FROM menu_items");
      res.json(rows);
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
