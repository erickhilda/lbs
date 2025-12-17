import { Command } from "commander";
import { Effect } from "effect";
import { initializeDb } from "./database/db";
import { utilService } from "./modules/util.service";
import { runEffect } from "./lib/effect-helper";
import { bookService } from "./modules/book/book.service";
import { memberService } from "./modules/member/member.service";
import { borrowRecordService } from "./modules/borrow-record/borrow-record.service";

const program = new Command();

initializeDb();

program
  .name("library")
  .description("Library Borrowing System CLI")
  .version("1.0.0");

program
  .command("add-book")
  .description("Add a new book to the library")
  .requiredOption("-t, --title <title>", "Book title")
  .requiredOption("-a, --author <author>", "Book author")
  .action(async (options) => {
    await runEffect(
      bookService.addBook(options.title, options.author).pipe(
        Effect.tap((book) => {
          console.log("Book added successfully!");
          console.log(`ID: ${book.id}`);
          console.log(`Title: ${book.title}`);
          console.log(`Author: ${book.author}`);
        }),
      ),
    );
  });

program
  .command("add-member")
  .description("Add a new member to the library")
  .requiredOption("-n, --name <name>", "Member name")
  .action(async (options) => {
    await runEffect(
      memberService.addMember(options.name).pipe(
        Effect.tap((member) => {
          console.log("Member added successfully!");
          console.log(`ID: ${member.id}`);
          console.log(`Name: ${member.name}`);
        }),
      ),
    );
  });

program
  .command("borrow")
  .description("Borrow a book")
  .requiredOption("-b, --book-id <bookId>", "Book ID", parseInt)
  .requiredOption("-m, --member-id <memberId>", "Member ID", parseInt)
  .action(async (options) => {
    await runEffect(
      borrowRecordService.borrowBook(options.bookId, options.memberId).pipe(
        Effect.tap((record) => {
          console.log("Book borrowed successfully!");
          console.log(`ID: ${record.id}`);
          console.log(`Book ID: ${record.bookId}`);
          console.log(`Member ID: ${record.memberId}`);
          console.log(`Borrow Date: ${record.borrowDate.toLocaleString()}`);
        }),
      ),
    );
  });

program
  .command("return")
  .description("Return a borrowed book")
  .requiredOption("-b, --book-id <bookId>", "Book ID", parseInt)
  .requiredOption("-m, --member-id <memberId>", "Member ID", parseInt)
  .action(async (options) => {
    await runEffect(
      borrowRecordService.returnBook(options.bookId, options.memberId).pipe(
        Effect.tap(() => {
          console.log("Book returned successfully!");
          console.log(`Book ID: ${options.bookId}`);
          console.log(`Member ID: ${options.memberId}`);
        }),
      ),
    );
  });

program
  .command("search")
  .description("Search for books")
  .option("-t, --title <title>", "Search by title")
  .option("-a, --author <author>", "Search by author")
  .action(async (options) => {
    if (!options.title && !options.author) {
      console.error("❌ Please provide at least one search criteria");
      process.exit(1);
    }

    await runEffect(
      bookService
        .searchBooks({
          title: options.title,
          author: options.author,
        })
        .pipe(
          Effect.tap((books) => {
            if (books.length === 0) {
              console.log("No books found matching your criteria");
              return;
            }

            console.log(`\nFound ${books.length} book(s):\n`);
            books.forEach((book) => {
              console.log(`ID: ${book.id}`);
              console.log(`Title: ${book.title}`);
              console.log(`Author: ${book.author}`);
              console.log(
                `Status: ${book.isAvailable ? "Available" : "Borrowed"}`,
              );
              console.log("---");
            });
          }),
        ),
    );
  });

program
  .command("member-books")
  .description("List books borrowed by a member")
  .requiredOption("-m, --member-id <memberId>", "Member ID", parseInt)
  .action(async (options) => {
    await runEffect(
      borrowRecordService.getMemberBorrowedBooks(options.memberId).pipe(
        Effect.tap((books) => {
          if (books.length === 0) {
            console.log(
              `Member ${options.memberId} has no borrowed books currently`,
            );
            return;
          }

          console.log(
            `\nMember ${options.memberId} has borrowed ${books.length} book(s):\n`,
          );
          books.forEach((book) => {
            console.log(`ID: ${book.id}`);
            console.log(`Title: ${book.title}`);
            console.log(`Author: ${book.author}`);
            console.log("---");
          });
        }),
      ),
    );
  });

program
  .command("stats")
  .description("Show library statistics")
  .action(async () => {
    await runEffect(
      utilService.getLibraryStats().pipe(
        Effect.tap((stats) => {
          console.log("\nLibrary Statistics:\n");
          console.log(`Total Books: ${stats.totalBooks}`);
          console.log(`Available Books: ${stats.availableBooks}`);
          console.log(
            `Borrowed Books: ${stats.totalBooks - stats.availableBooks}`,
          );
          console.log(`Total Members: ${stats.totalMembers}`);
          console.log(`Active Borrowings: ${stats.activeBorrowings}`);
        }),
      ),
    );
  });

program
  .command("list-books")
  .description("List all books in the library")
  .action(async () => {
    await runEffect(
      bookService.searchBooks({}).pipe(
        Effect.tap((books) => {
          if (books.length === 0) {
            console.log("No books in the library");
            return;
          }

          console.log(`\nLibrary Collection (${books.length} books):\n`);
          books.forEach((book) => {
            console.log(
              `ID: ${book.id} | ${book.title} by ${book.author} (${book.isAvailable ? "Available" : "Borrowed"})`,
            );
            console.log(``);
          });
        }),
      ),
    );
  });

program.parse();
