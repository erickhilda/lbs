import { Book } from "./book.model";
import { db } from "../../database/db";
import { Effect } from "effect";
import type { ErrorMessage, SearchCriteria } from "../../types";

export class BookService {
  addBook(title: string, author: string): Effect.Effect<Book, ErrorMessage> {
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

  getBook(bookId: number): Effect.Effect<Book, ErrorMessage> {
    return Effect.try({
      try: () => {
        const stmt = db.prepare("SELECT * FROM books WHERE id = ?");
        const row = stmt.get(bookId) as any;

        if (!row) {
          return Effect.fail({
            type: "BookNotFound" as const,
            bookId,
          });
        }

        return Effect.succeed(
          new Book({
            id: row.id,
            title: row.title,
            author: row.author,
            isAvailable: Boolean(row.is_available),
          }),
        );
      },
      catch: (error) => {
        if (Effect.isEffect(error)) {
          return error;
        }
        return Effect.fail({
          type: "DatabaseError" as const,
          message: `Failed to get book: ${error}`,
        });
      },
    }).pipe(Effect.flatten);
  }

  searchBooks(criteria: SearchCriteria): Effect.Effect<Book[], ErrorMessage> {
    return Effect.try({
      try: () => {
        let query = "SELECT * FROM books WHERE 1=1";
        const params: any[] = [];

        if (criteria.title) {
          query += " AND title LIKE ?";
          params.push(`%${criteria.title}%`);
        }

        if (criteria.author) {
          query += " AND author LIKE ?";
          params.push(`%${criteria.author}%`);
        }

        const stmt = db.prepare(query);
        const rows = stmt.all(...params) as any[];

        return rows.map(
          (row) =>
            new Book({
              id: row.id,
              title: row.title,
              author: row.author,
              isAvailable: Boolean(row.is_available),
            }),
        );
      },
      catch: (error) => ({
        type: "DatabaseError" as const,
        message: `Failed to search books: ${error}`,
      }),
    });
  }
}

export const bookService = new BookService();
