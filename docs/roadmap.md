# Library Borrowing System - Project Plan

## Project Overview
Technology stack: Bun + Typescript + SQLite

## M-1 - Project Setup

### Task:
- [x] Initialize project with Bun
- [x] Set up Typescript configuration
- [x] Install necessary dependencies
- [x] Create SQLite database schema
- [x] Set up Bun test runner

### Deliverables:
- [x] Project setup complete
- [x] Typescript configuration set up
- [x] Dependencies installed
- [x] SQLite database schema created

## M-2: Core Domain Models

### Task:
- [x] Create `Book` class with properties: id, title, author, isAvailable
- [x] Create `Member` class with properties: id, name, borrowedBooks
- [x] Create `BorrowRecord` class with properties: id, bookId, memberId, borrowDate, returnDate
- [x] Write unit tests for domain models

## M-3: API Endpoints

### Tasks:
- [x] Create `BookService` class with:
  - [x] Implement `addBook()` method with SQLite insert
  - [x] Implement `searchBooks()` by title or author
- [x] Create `MemberService` class with:
  - [x] Implement `addMember()` method
  - [x] Implement `getMember()` by name
- [x] Create `BorrowService` class with:
  - [x] Implement `getMemberBorrowedBooks()` method
  - [x] Implement `borrowBook()` method with business rules:
    - Check if book exists
    - Check if book is available
    - Check if member exists
    - Create borrow record
    - Update book availability
  - [x] Implement `returnBook()` method
- [x] Add proper Effect error handling

## M-4: Unit Tests

### Tasks:
- [x] Write tests for BookService
- [x] Write tests for MemberService
- [ ] Write tests for BorrowService:
  - Test successful book borrowing
  - Test borrowing unavailable book (should fail)
  - Test borrowing non-existent book (should fail)
  - Test successful book return
  - Test search by title
  - Test search by author
  - Test member borrowed books list

## M-5: Demo and Wrap Up

### Tasks:
- [x] Build the app and run as a cli app
- [ ] Run demo showing:
  - Adding books
  - Adding members
  - Borrowing books
  - Attempting invalid operations
  - Searching books
  - Returning books
- [ ] Show test results
- [ ] Quick code walkthrough
