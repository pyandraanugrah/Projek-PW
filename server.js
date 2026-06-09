const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const MENU_SEED = [
  ["CIWENG", 10000, "Camilan berbahan dasar aci yang gurih dan renyah.", "src/ciweng.jpeg"],
  ["MOLACHEE", 10000, "Makanan ringan dengan cita rasa khas dan tekstur kenyal yang lezat.", "src/molachee.jpeg"],
  ["CILUKBA", 10000, "Camilan gurih dengan tekstur renyah di luar dan lembut di dalam.", "src/cilukba.jpeg"]
];

let query;

if (process.env.DATABASE_URL) {
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);

  query = {
    async menu() {
      await sql(`CREATE TABLE IF NOT EXISTS menu_items (id SERIAL PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL, description TEXT, image TEXT)`);
      const { rows: c } = await sql("SELECT COUNT(*)::int as c FROM menu_items");
      if (c[0].c === 0) {
        for (const m of MENU_SEED) {
          await sql("INSERT INTO menu_items (name, price, description, image) VALUES ($1, $2, $3, $4)", m);
        }
      }
      const { rows } = await sql("SELECT * FROM menu_items");
      return rows;
    },
    async createOrder(name, phone, address, items, total) {
      const { rows } = await sql(
        "INSERT INTO orders (customer_name, phone, address, items, total) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [name, phone, address, JSON.stringify(items), total]
      );
      return rows[0].id;
    },
    async orders() {
      const { rows } = await sql("SELECT * FROM orders ORDER BY created_at DESC");
      return rows;
    },
    async init() {
      await sql(`CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, customer_name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, items TEXT NOT NULL, total INTEGER NOT NULL, status TEXT DEFAULT 'pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    }
  };

  query.init();
} else {
  const Database = require("better-sqlite3");
  const db = new Database("database.sqlite");
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price INTEGER NOT NULL, description TEXT, image TEXT);
    CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, items TEXT NOT NULL, total INTEGER NOT NULL, status TEXT DEFAULT 'pending', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  `);

  const count = db.prepare("SELECT COUNT(*) as c FROM menu_items").get();
  if (count.c === 0) {
    const ins = db.prepare("INSERT INTO menu_items (name, price, description, image) VALUES (?, ?, ?, ?)");
    for (const m of MENU_SEED) ins.run(...m);
  }

  query = {
    menu: () => db.prepare("SELECT * FROM menu_items").all(),
    createOrder: (name, phone, address, items, total) => {
      const r = db.prepare("INSERT INTO orders (customer_name, phone, address, items, total) VALUES (?, ?, ?, ?, ?)").run(name, phone, address, JSON.stringify(items), total);
      return r.lastInsertRowid;
    },
    orders: () => db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all(),
    init: () => {}
  };
}

app.get("/api/menu", async (req, res) => {
  const items = await query.menu();
  res.json(items);
});

app.post("/api/orders", async (req, res) => {
  const { customer_name, phone, address, items } = req.body;
  if (!customer_name || !phone || !address || !items || !items.length) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const id = await query.createOrder(customer_name, phone, address, items, total);
  res.status(201).json({ id, message: "Pesanan berhasil dibuat!", total });
});

app.get("/api/orders", async (req, res) => {
  const orders = await query.orders();
  res.json(orders);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
