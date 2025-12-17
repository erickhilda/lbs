import { Effect } from "effect";
import { db } from "../../database/db";
import { Book } from "../book/book.model";
import { BorrowRecord } from "./borrow-record.model";
import type { ErrorMessage } from "../../types";

export class BorrowRecordService {
  borrowBook(
    bookId: number,
    memberId: number,
  ): Effect.Effect<BorrowRecord, ErrorMessage> {
    return Effect.gen(this, function* () {
      const bookStmt = db.prepare("SELECT * FROM books WHERE id = ?");
      const bookRow = bookStmt.get(bookId) as any;

      if (!bookRow) {
        return yield* Effect.fail({
          type: "BookNotFound" as const,
          bookId,
        });
      }

      if (!bookRow.is_available) {
        return yield* Effect.fail({
          type: "BookUnavailable" as const,
          bookId,
          title: bookRow.title,
        });
      }

      const memberStmt = db.prepare("SELECT * FROM members WHERE id = ?");
      const memberRow = memberStmt.get(memberId) as any;

      if (!memberRow) {
        return yield* Effect.fail({
          type: "MemberNotFound" as const,
          memberId,
        });
      }

      const borrowDate = new Date();
      const insertStmt = db.prepare(
        "INSERT INTO borrow_records (book_id, member_id, borrow_date, return_date) VALUES (?, ?, ?, NULL)",
      );
      const result = insertStmt.run(bookId, memberId, borrowDate.toISOString());

      const updateStmt = db.prepare(
        "UPDATE books SET is_available = 0 WHERE id = ?",
      );
      updateStmt.run(bookId);

      const borrowRecord = new BorrowRecord({
        id: Number(result.lastInsertRowid),
        bookId,
        memberId,
        borrowDate,
        returnDate: null,
      });

      return borrowRecord;
    }).pipe(
      Effect.catchAll((error) => {
        if ("type" in error) {
          return Effect.fail(error as ErrorMessage);
        }
        return Effect.fail({
          type: "DatabaseError" as const,
          message: `Failed to borrow book: ${error}`,
        });
      }),
    );
  }

  returnBook(
    bookId: number,
    memberId: number,
  ): Effect.Effect<void, ErrorMessage> {
    return Effect.gen(this, function* () {
      const bookStmt = db.prepare("SELECT * FROM books WHERE id = ?");
      const bookRow = bookStmt.get(bookId) as any;

      if (!bookRow) {
        return yield* Effect.fail({
          type: "BookNotFound" as const,
          bookId,
        });
      }

      const borrowStmt = db.prepare(
        "SELECT * FROM borrow_records WHERE book_id = ? AND member_id = ? AND return_date IS NULL",
      );
      const borrowRow = borrowStmt.get(bookId, memberId) as any;

      if (!borrowRow) {
        return yield* Effect.fail({
          type: "BookNotBorrowed" as const,
          bookId,
          memberId,
        });
      }

      const returnDate = new Date();
      const updateBorrowStmt = db.prepare(
        "UPDATE borrow_records SET return_date = ? WHERE id = ?",
      );
      updateBorrowStmt.run(returnDate.toISOString(), borrowRow.id);

      const updateBookStmt = db.prepare(
        "UPDATE books SET is_available = 1 WHERE id = ?",
      );
      updateBookStmt.run(bookId);

      return Effect.succeed(undefined);
    }).pipe(
      Effect.flatten,
      Effect.catchAll((error) => {
        if ("type" in error) {
          return Effect.fail(error as ErrorMessage);
        }
        return Effect.fail({
          type: "DatabaseError" as const,
          message: `Failed to return book: ${error}`,
        });
      }),
    );
  }

  getMemberBorrowedBooks(
    memberId: number,
  ): Effect.Effect<Book[], ErrorMessage> {
    return Effect.try({
      try: () => {
        // Check if member exists
        const memberStmt = db.prepare("SELECT * FROM members WHERE id = ?");
        const memberRow = memberStmt.get(memberId) as any;

        if (!memberRow) {
          return Effect.fail({
            type: "MemberNotFound" as const,
            memberId,
          });
        }

        const stmt = db.prepare(`
          SELECT b.* FROM books b
          INNER JOIN borrow_records br ON b.id = br.book_id
          WHERE br.member_id = ? AND br.return_date IS NULL
        `);
        const rows = stmt.all(memberId) as any[];

        return Effect.succeed(
          rows.map(
            (row) =>
              new Book({
                id: row.id,
                title: row.title,
                author: row.author,
                isAvailable: Boolean(row.is_available),
              }),
          ),
        );
      },
      catch: (error) => {
        if (Effect.isEffect(error)) {
          return error;
        }
        return Effect.fail({
          type: "DatabaseError" as const,
          message: `Failed to get member borrowed books: ${error}`,
        });
      },
    }).pipe(Effect.flatten);
  }
}

export const borrowRecordService = new BorrowRecordService();
