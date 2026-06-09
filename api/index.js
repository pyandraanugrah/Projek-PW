const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const ROOT = path.join(__dirname, "..");

app.use(express.json());
app.use(express.static(ROOT));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const MENU_SEED = [
  ["CIWENG", 10000, "Camilan berbahan dasar aci yang gurih dan renyah.", "src/ciweng.jpeg"],
  ["MOLACHEE", 10000, "Makanan ringan dengan cita rasa khas dan tekstur kenyal yang lezat.", "src/molachee.jpeg"],
  ["CILUKBA", 10000, "Camilan gurih dengan tekstur renyah di luar dan lembut di dalam.", "src/cilukba.jpeg"]
];

async function q(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

app.get("/api/menu", async (req, res) => {
  try {
    await q(`CREATE TABLE IF NOT EXISTS menu_items (id SERIAL PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL, description TEXT, image TEXT)`);
    const { rows: c } = await q("SELECT COUNT(*)::int as c FROM menu_items");
    if (c[0].c === 0) {
      for (const m of MENU_SEED) {
        await q("INSERT INTO menu_items (name, price, description, image) VALUES ($1,$2,$3,$4)", m);
      }
    }
    const { rows } = await q("SELECT * FROM menu_items");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    await q(`CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, customer_name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, items TEXT NOT NULL, total INTEGER NOT NULL, status TEXT DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    const { customer_name, phone, address, items } = req.body;
    if (!customer_name || !phone || !address || !items?.length) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const { rows } = await q(
      "INSERT INTO orders (customer_name, phone, address, items, total) VALUES ($1,$2,$3,$4,$5) RETURNING id",
      [customer_name, phone, address, JSON.stringify(items), total]
    );
    res.status(201).json({ id: rows[0].id, message: "Pesanan berhasil dibuat!", total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const { rows } = await q("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(ROOT, "index.html"));
});

module.exports = app;
