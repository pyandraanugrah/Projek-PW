import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sql = neon(process.env.DATABASE_URL);

  await sql(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      image TEXT
    )
  `);

  const { rows: countRows } = await sql(
    "SELECT COUNT(*)::int as c FROM menu_items"
  );

  if (countRows[0].c === 0) {
    await sql(`
      INSERT INTO menu_items (name, price, description, image) VALUES
        ('CIWENG', 10000, 'Camilan berbahan dasar aci yang gurih dan renyah.', 'src/ciweng.jpeg'),
        ('MOLACHEE', 10000, 'Makanan ringan dengan cita rasa khas dan tekstur kenyal yang lezat.', 'src/molachee.jpeg'),
        ('CILUKBA', 10000, 'Camilan gurih dengan tekstur renyah di luar dan lembut di dalam.', 'src/cilukba.jpeg')
    `);
  }

  const { rows } = await sql("SELECT * FROM menu_items");
  res.json(rows);
}
