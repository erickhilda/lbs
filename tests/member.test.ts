import { describe, test, expect } from "bun:test";
import { Effect } from "effect";
import { bookService } from "../src/modules/book/book.service";
import { memberService } from "../src/modules/member/member.service";
import { borrowRecordService } from "../src/modules/borrow-record/borrow-record.service";

/**
 * Helper to run Effect and get result
 */
async function runEffect<A, E>(effect: Effect.Effect<A, E>): Promise<A> {
  return await Effect.runPromise(effect);
}

/**
 * Helper to run Effect and expect it to fail
 */
async function runEffectExpectError<A, E>(
  effect: Effect.Effect<A, E>,
): Promise<E> {
  const result = await Effect.runPromise(Effect.either(effect));
  if (result._tag === "Right") {
    throw new Error("Expected effect to fail but it succeeded");
  }
  return result.left;
}

describe("MemberService - Member Operations", () => {
  test("addMember creates a new member with correct properties", async () => {
    const member = await runEffect(memberService.addMember("Alice Johnson"));

    expect(member.id).toBeGreaterThan(0);
    expect(member.name).toBe("Alice Johnson");
    expect(member.borrowedBooks).toEqual([]);
  });

  test("getMember fails with MemberNotFound for non-existent ID", async () => {
    const error = await runEffectExpectError(memberService.getMember(9999));

    expect(error.type).toBe("MemberNotFound");
    expect(error).toHaveProperty("memberId", 9999);
  });

  test("getMember includes borrowed books IDs", async () => {
    const book = await runEffect(
      bookService.addBook("Test Book", "Test Author"),
    );
    const member = await runEffect(memberService.addMember("Test Member"));

    await runEffect(borrowRecordService.borrowBook(book.id, member.id));

    const foundMember = await runEffect(memberService.getMember(member.id));

    expect(foundMember.borrowedBooks).toContain(book.id);
    expect(foundMember.borrowedBooks.length).toBe(1);
  });

  test("getMemberBorrowedBooks returns empty array for member with no books", async () => {
    const member = await runEffect(memberService.addMember("Test Member"));

    const books = await runEffect(
      borrowRecordService.getMemberBorrowedBooks(member.id),
    );

    expect(books).toEqual([]);
  });

  test("getMemberBorrowedBooks returns correct books", async () => {
    const book1 = await runEffect(bookService.addBook("Book 1", "Author 1"));
    const book2 = await runEffect(bookService.addBook("Book 2", "Author 2"));
    const book3 = await runEffect(bookService.addBook("Book 3", "Author 3"));
    const member = await runEffect(memberService.addMember("Test Member"));

    // Borrow two books
    await runEffect(borrowRecordService.borrowBook(book1.id, member.id));
    await runEffect(borrowRecordService.borrowBook(book3.id, member.id));

    const borrowedBooks = await runEffect(
      borrowRecordService.getMemberBorrowedBooks(member.id),
    );

    expect(borrowedBooks.length).toBe(2);
    expect(borrowedBooks.some((b) => b.id === book1.id)).toBe(true);
    expect(borrowedBooks.some((b) => b.id === book3.id)).toBe(true);
    expect(borrowedBooks.some((b) => b.id === book2.id)).toBe(false);
  });

  test("getMemberBorrowedBooks fails with MemberNotFound", async () => {
    const error = await runEffectExpectError(
      borrowRecordService.getMemberBorrowedBooks(9999),
    );

    expect(error.type).toBe("MemberNotFound");
    expect(error).toHaveProperty("memberId", 9999);
  });

  test("getMemberBorrowedBooks excludes returned books", async () => {
    const book = await runEffect(
      bookService.addBook("Test Book", "Test Author"),
    );
    const member = await runEffect(memberService.addMember("Test Member"));

    // Borrow and return
    await runEffect(borrowRecordService.borrowBook(book.id, member.id));
    await runEffect(borrowRecordService.returnBook(book.id, member.id));

    const borrowedBooks = await runEffect(
      borrowRecordService.getMemberBorrowedBooks(member.id),
    );

    expect(borrowedBooks).toEqual([]);
  });
});
