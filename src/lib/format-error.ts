import type { ErrorMessage } from "../types";

export function formatError(error: ErrorMessage): string {
  switch (error.type) {
    case "BookNotFound":
      return `Book with ID ${error.bookId} not found`;
    case "MemberNotFound":
      return `Member with ID ${error.memberId} not found`;
    case "BookUnavailable":
      return `Book "${error.title}" (ID: ${error.bookId}) is not available`;
    case "BookNotBorrowed":
      return `Book ${error.bookId} is not borrowed by member ${error.memberId}`;
    case "DatabaseError":
      return `Database error: ${error.message}`;
  }
}
