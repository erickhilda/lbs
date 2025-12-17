# Library Borrowing System - Project Plan

## Project Overview
Technology stack: Bun + Typescript + SQLite

## M-1 - Project Setup

### Task:
- [ ] Initialize project with Bun
- [ ] Set up Typescript configuration
- [ ] Install necessary dependencies
- [ ] Create SQLite database schema
- [ ] Set up Bun test runner

### Deliverables:
- [ ] Project setup complete
- [ ] Typescript configuration set up
- [ ] Dependencies installed
- [ ] SQLite database schema created

## M-2: Core Domain Models

### Task:
- [ ] Create `Book` class with properties: id, title, author, isAvailable
- [ ] Create `Member` class with properties: id, name, borrowedBooks
- [ ] Create `BorrowRecord` class with properties: id, bookId, memberId, borrowDate, returnDate
- [ ] Write unit tests for domain models

## M-3: API Endpoints

### Tasks:
- [ ] Create `BookService` class with:
  - [ ] Implement `addBook()` method with SQLite insert
  - [ ] Implement `searchBooks()` by title or author
- [ ] Create `MemberService` class with:
  - [ ] Implement `addMember()` method
  - [ ] Implement `getMember()` by name
- [ ] Create `BorrowService` class with:
  - [ ] Implement `getMemberBorrowedBooks()` method
  - [ ] Implement `borrowBook()` method with business rules:
    - Check if book exists
    - Check if book is available
    - Check if member exists
    - Create borrow record
    - Update book availability
  - [ ] Implement `returnBook()` method
- [ ] Add proper Effect error handling

## M-4: Unit Tests

### Tasks:
- [ ] Write tests for BookService
- [ ] Write tests for MemberService
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
- [ ] Build the app and run as a cli app
- [ ] Run demo showing:
  - Adding books
  - Adding members
  - Borrowing books
  - Attempting invalid operations
  - Searching books
  - Returning books
- [ ] Show test results
- [ ] Quick code walkthrough
