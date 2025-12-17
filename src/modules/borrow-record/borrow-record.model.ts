export interface BorrowRecordData {
  id?: number;
  bookId: number;
  memberId: number;
  borrowDate: Date;
  returnDate: Date | null;
}

export class BorrowRecord {
  private _id: number | undefined;
  private _bookId: number;
  private _memberId: number;
  private _borrowDate: Date;
  private _returnDate: Date | null;

  constructor(data: BorrowRecordData) {
    if (data.bookId <= 0) {
      throw new Error("Invalid book ID");
    }
    if (data.memberId <= 0) {
      throw new Error("Invalid member ID");
    }
    if (!(data.borrowDate instanceof Date)) {
      throw new Error("Borrow date must be a valid Date");
    }
    if (data.returnDate && !(data.returnDate instanceof Date)) {
      throw new Error("Return date must be a valid Date");
    }
    if (data.returnDate && data.returnDate < data.borrowDate) {
      throw new Error("Return date cannot be before borrow date");
    }

    this._id = data.id;
    this._bookId = data.bookId;
    this._memberId = data.memberId;
    this._borrowDate = data.borrowDate;
    this._returnDate = data.returnDate;
  }

  get id(): number | undefined {
    return this._id;
  }

  get bookId(): number {
    return this._bookId;
  }

  get memberId(): number {
    return this._memberId;
  }

  get borrowDate(): Date {
    return this._borrowDate;
  }

  get returnDate(): Date | null {
    return this._returnDate;
  }

  get isReturned(): boolean {
    return this._returnDate !== null;
  }

  markAsReturned(returnDate: Date = new Date()): void {
    if (this._returnDate !== null) {
      throw new Error("Book has already been returned");
    }
    if (returnDate < this._borrowDate) {
      throw new Error("Return date cannot be before borrow date");
    }
    this._returnDate = returnDate;
  }

  getDaysBorrowed(): number {
    const endDate = this._returnDate || new Date();
    const diffTime = endDate.getTime() - this._borrowDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toJSON(): BorrowRecordData {
    return {
      id: this._id,
      bookId: this._bookId,
      memberId: this._memberId,
      borrowDate: this._borrowDate,
      returnDate: this._returnDate,
    };
  }
}
