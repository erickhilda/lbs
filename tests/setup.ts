import { beforeEach, afterAll } from "bun:test";
import { db, initializeDb } from "../src/database/db";

initializeDb();

function clearDatabase() {
  db.run(`DELETE FROM books`);
  db.run(`DELETE FROM members`);
  db.run(`DELETE FROM borrow_records`);
}

beforeEach(async () => {
  clearDatabase();
});

afterAll(async () => {
  db.close();
});
