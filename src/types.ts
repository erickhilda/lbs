export type SearchCriteria = {
  title?: string;
  author?: string;
};

export type ErrorMessage =
  | { type: "BookNotFound"; bookId: number }
  | { type: "MemberNotFound"; memberId: number }
  | { type: "BookUnavailable"; bookId: number; title: string }
  | { type: "BookNotBorrowed"; bookId: number; memberId: number }
  | { type: "DatabaseError"; message: string };

export interface LibraryStats {
  totalBooks: number;
  availableBooks: number;
  totalMembers: number;
  activeBorrowings: number;
}
