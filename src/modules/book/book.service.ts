import { Book } from "./book.model";
import { db } from "../../database/db";
import { Effect } from "effect";

export class BookService {
  addBook(title: string, author: string): Effect.Effect<Book> {
    return Effect.try({
      try: () => {
        const stmt = db.prepare(
          "INSERT INTO books (title, author) VALUES (?, ?)",
        );
        const result = stmt.run(title, author);

        const bookId = Number(result.lastInsertRowid);
        return new Book({ id: bookId, title, author, isAvailable: true });
      },
      catch: (err) => ({
        type: "DatabaseError",
        message: "Failed to add book",
      }),
    });
  }
}
