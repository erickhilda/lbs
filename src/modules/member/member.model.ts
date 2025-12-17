export interface MemberData {
  id: number;
  name: string;
  borrowedBooks: number[];
}

export class Member {
  private _id: number;
  private _name: string;
  private _borrowedBooks: Set<number>;

  constructor(data: MemberData) {
    // Validation
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Member name cannot be empty");
    }
    if (data.name.trim().length < 2) {
      throw new Error("Member name must be at least 2 characters");
    }

    this._id = data.id;
    this._name = data.name.trim();
    this._borrowedBooks = new Set(data.borrowedBooks || []);
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get borrowedBooks(): number[] {
    return Array.from(this._borrowedBooks);
  }

  get borrowedBooksCount(): number {
    return this._borrowedBooks.size;
  }

  borrowBook(bookId: number): void {
    if (this._borrowedBooks.has(bookId)) {
      throw new Error(`Member "${this._name}" already has book ${bookId}`);
    }
    this._borrowedBooks.add(bookId);
  }

  returnBook(bookId: number): void {
    if (!this._borrowedBooks.has(bookId)) {
      throw new Error(`Member "${this._name}" does not have book ${bookId}`);
    }
    this._borrowedBooks.delete(bookId);
  }

  hasBook(bookId: number): boolean {
    return this._borrowedBooks.has(bookId);
  }

  toJSON(): MemberData {
    return {
      id: this._id,
      name: this._name,
      borrowedBooks: this.borrowedBooks,
    };
  }
}
