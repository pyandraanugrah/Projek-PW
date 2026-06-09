import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          customer_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          address TEXT NOT NULL,
          items TEXT NOT NULL,
          total INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      if (req.method === "GET") {
        const { rows } = await client.query(
          "SELECT * FROM orders ORDER BY created_at DESC"
        );
        return res.json(rows);
      }

      if (req.method === "POST") {
        const { customer_name, phone, address, items } = req.body;

        if (!customer_name || !phone || !address || !items?.length) {
          return res.status(400).json({ error: "Semua field harus diisi" });
        }

        const total = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const { rows } = await client.query(
          "INSERT INTO orders (customer_name, phone, address, items, total) VALUES ($1, $2, $3, $4, $5) RETURNING id",
          [customer_name, phone, address, JSON.stringify(items), total]
        );

        return res.status(201).json({
          id: rows[0].id,
          message: "Pesanan berhasil dibuat!",
          total,
        });
      }

      res.status(405).json({ error: "Method not allowed" });
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Database error" });
  }
}
