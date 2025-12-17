import { beforeEach, afterAll } from "bun:test";
import { db, initializeDb } from "../src/database/db";

initializeDb();

function clearDatabase() {
  db.run("PRAGMA foreign_keys = OFF");

  db.run("DELETE FROM borrow_records");
  db.run("DELETE FROM books");
  db.run("DELETE FROM members");

  db.run("DELETE FROM sqlite_sequence WHERE name='borrow_records'");
  db.run("DELETE FROM sqlite_sequence WHERE name='books'");
  db.run("DELETE FROM sqlite_sequence WHERE name='members'");

  db.run("PRAGMA foreign_keys = ON");
}

beforeEach(() => {
  clearDatabase();
});

afterAll(() => {
  clearDatabase();
  db.close();
});
