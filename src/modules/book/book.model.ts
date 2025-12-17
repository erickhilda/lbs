export interface BookData {
  id: number;
  title: string;
  author: string;
  isAvailable: boolean;
}

export class Book {
  private _id: number;
  private _title: string;
  private _author: string;
  private _isAvailable: boolean;

  constructor(data: BookData) {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error("Book title is required");
    }

    if (!data.author || data.author.trim().length === 0) {
      throw new Error("Book author is required");
    }

    this._id = data.id;
    this._title = data.title;
    this._author = data.author;
    this._isAvailable = data.isAvailable;
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get author(): string {
    return this._author;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  markAsAvailable(): void {
    this._isAvailable = true;
  }

  markAsUnavailable(): void {
    this._isAvailable = false;
  }

  toJSON(): BookData {
    return {
      id: this._id,
      title: this._title,
      author: this._author,
      isAvailable: this._isAvailable,
    };
  }
}
