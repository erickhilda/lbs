import { Database } from "bun:sqlite";

export const db = new Database("library.db");

export function initializeDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      is_available INTEGER NOT NULL DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS borrow_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      member_id INTEGER NOT NULL,
      borrow_date TEXT NOT NULL,
      return_date TEXT NOT NULL,
      FOREIGN KEY (book_id) REFERENCES books(id),
      FOREIGN KEY (member_id) REFERENCES members(id)
    )
  `);
}
