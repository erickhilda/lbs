import { Effect } from "effect";
import { db } from "../database/db";
import type { ErrorMessage, LibraryStats } from "../types";

export class UtilService {
  getLibraryStats(): Effect.Effect<LibraryStats, ErrorMessage> {
    return Effect.try({
      try: () => {
        const totalBooksStmt = db.prepare(
          "SELECT COUNT(*) as count FROM books",
        );
        const totalBooks = (totalBooksStmt.get() as any).count;

        const availableBooksStmt = db.prepare(
          "SELECT COUNT(*) as count FROM books WHERE is_available = 1",
        );
        const availableBooks = (availableBooksStmt.get() as any).count;

        const totalMembersStmt = db.prepare(
          "SELECT COUNT(*) as count FROM members",
        );
        const totalMembers = (totalMembersStmt.get() as any).count;

        const activeBorrowingsStmt = db.prepare(
          "SELECT COUNT(*) as count FROM borrowings WHERE return_date IS NULL",
        );
        const activeBorrowings = (activeBorrowingsStmt.get() as any).count;

        return {
          totalBooks,
          availableBooks,
          totalMembers,
          activeBorrowings,
        };
      },
      catch: (error) => ({
        type: "DatabaseError" as const,
        message: `Failed to get library stats: ${error}`,
      }),
    });
  }
}

export const utilService = new UtilService();
