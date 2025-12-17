import { describe, test, expect } from "bun:test";
import { Effect } from "effect";
import { bookService } from "../src/modules/book/book.service";

/**
 * Helper to run Effect and get result
 */
async function runEffect<A, E>(effect: Effect.Effect<A, E>): Promise<A> {
  return await Effect.runPromise(effect);
}

describe("BookService - Book Operations", () => {
  test("addBook creates a new book with correct properties", async () => {
    const book = await runEffect(
      bookService.addBook("Test Book", "Test Author"),
    );

    expect(book.id).toBeGreaterThan(0);
    expect(book.title).toBe("Test Book");
    expect(book.author).toBe("Test Author");
    expect(book.isAvailable).toBe(true);
  });

  test("searchBooks finds books by title (case-insensitive)", async () => {
    await runEffect(
      bookService.addBook("The Great Gatsby", "F. Scott Fitzgerald"),
    );
    await runEffect(
      bookService.addBook("Great Expectations", "Charles Dickens"),
    );
    await runEffect(bookService.addBook("1984", "George Orwell"));

    const results = await runEffect(
      bookService.searchBooks({ title: "great" }),
    );

    expect(results.length).toBe(2);
    expect(results.some((b) => b.title === "The Great Gatsby")).toBe(true);
    expect(results.some((b) => b.title === "Great Expectations")).toBe(true);
  });

  test("searchBooks finds books by author (case-insensitive)", async () => {
    await runEffect(bookService.addBook("1984", "George Orwell"));
    await runEffect(bookService.addBook("Animal Farm", "George Orwell"));
    await runEffect(bookService.addBook("Brave New World", "Aldous Huxley"));

    const results = await runEffect(
      bookService.searchBooks({ author: "orwell" }),
    );

    expect(results.length).toBe(2);
    expect(results.every((b) => b.author === "George Orwell")).toBe(true);
  });

  test("searchBooks finds books by both title and author", async () => {
    await runEffect(bookService.addBook("Harry Potter", "J.K. Rowling"));
    await runEffect(bookService.addBook("Harry Dresden", "Jim Butcher"));
    await runEffect(bookService.addBook("Fantastic Beasts", "J.K. Rowling"));

    const results = await runEffect(
      bookService.searchBooks({ title: "Harry", author: "Rowling" }),
    );

    expect(results.length).toBe(1);
    expect(results?.[0]?.title).toBe("Harry Potter");
  });

  test("searchBooks returns empty array when no matches", async () => {
    await runEffect(bookService.addBook("Test Book", "Test Author"));

    const results = await runEffect(
      bookService.searchBooks({ title: "NonExistent" }),
    );

    expect(results.length).toBe(0);
  });

  test("searchBooks returns all books when no criteria provided", async () => {
    await runEffect(bookService.addBook("Book 1", "Author 1"));
    await runEffect(bookService.addBook("Book 2", "Author 2"));
    await runEffect(bookService.addBook("Book 3", "Author 3"));

    const results = await runEffect(bookService.searchBooks({}));

    expect(results.length).toBe(3);
  });
});
