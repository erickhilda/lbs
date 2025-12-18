# Library Borrowing System

A modern library management system built with TypeScript, featuring type-safe error handling and a clean OOP architecture. This system allows you to manage books, members, and borrowing operations with built-in business rules enforcement.

## 🚀 Features

- **Book Management**: Add, search, and track book availability
- **Member Management**: Register and manage library members
- **Borrowing System**: Handle book checkouts and returns with automatic availability tracking
- **Smart Search**: Find books by title, author, or both (case-insensitive)
- **Business Rules**: Enforce borrowing constraints (e.g., books can't be borrowed if already checked out)
- **Type-Safe Error Handling**: Leverages Effect library for functional error management
- **Comprehensive Testing**: Full test suite covering all major behaviors

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast all-in-one JavaScript runtime
- **Language**: TypeScript - Type-safe JavaScript
- **Effect Library**: [Effect](https://effect.website/) - Powerful library for type-safe error handling and dependency management
- **Database**: SQLite (bun:sqlite) - Embedded, serverless database
- **Testing**: Bun's built-in test runner

## 📁 Project Structure

```
lbs/
├── README.md
├── bun.lock
├── docs
│   └── roadmap.md
├── package.json
├── src
│   ├── database          # place for database configuration
│   ├── index.ts          # main entry point of the application
│   ├── lib               # place for utility functions and helpers 
│   ├── modules           # place for business logic modules
│   │   ├── book
│   │   ├── borrow-record
│   │   ├── member
│   └── types.ts          # place for type definitions
├── tests
│   └── setup.ts          # place for test setup and teardown
└── tsconfig.json
```

## 🚦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/erickhilda/lbs
cd lbs
```

2. Install dependencies:
```bash
bun install
```

3. Initialize the database:
```bash
bun run start
```

The SQLite database will be automatically created with the necessary tables.

## 🎮 Usage

### Running the Application

```bash
bun run start
```

### Running Tests

```bash
# Run all tests
bun run test

# Run specific test file
bun run test tests/book.test.ts

```

## Building the Binary

### Build for Your Current Platform

```bash
bun run build
```

This creates a standalone binary called `library` (or `library.exe` on Windows) that includes everything needed to run - no Bun or Node.js runtime required!

### Build for Specific Platforms

```bash
# Linux (x64)
bun run build:linux

# macOS (Intel)
bun run build:mac

# macOS (Apple Silicon)
bun run build:mac-arm

# Windows (x64)
bun run build:windows

# Build for all platforms
bun run build:all
```

### Binary Size

The compiled binary is approximately 50-60MB and includes:
- Your application code
- Bun runtime
- SQLite database engine
- All dependencies

## Usage

### Using the Binary

After building, you can run the binary directly:

```bash
# On Linux/macOS
./library --help

# On Windows
library.exe --help
```

### Available Commands

#### Add a Book

```bash
./library add-book --title "The Great Gatsby" --author "F. Scott Fitzgerald"
```

**Aliases:**
```bash
./library add-book -t "1984" -a "George Orwell"
```

#### Add a Member

```bash
./library add-member --name "John Doe"
```

**Aliases:**
```bash
./library add-member -n "Jane Smith"
```

#### Borrow a Book

```bash
./library borrow --book-id 1 --member-id 1
```

**Aliases:**
```bash
./library borrow -b 1 -m 1
```

#### Return a Book

```bash
./library return --book-id 1 --member-id 1
```

**Aliases:**
```bash
./library return -b 1 -m 1
```

#### Search Books

Search by title:
```bash
./library search --title "Gatsby"
```

Search by author:
```bash
./library search --author "Orwell"
```

Search by both:
```bash
./library search --title "Great" --author "Fitzgerald"
```

**Aliases:**
```bash
./library search -t "1984" -a "Orwell"
```

#### List Member's Borrowed Books

```bash
./library member-books --member-id 1
```

**Aliases:**
```bash
./library member-books -m 1
```

#### View Library Statistics

```bash
./library stats
```

#### List All Books

```bash
./library list-books
```

### Get Help

```bash
# General help
./library --help

# Command-specific help
./library add-book --help
./library borrow --help
```

## Example Workflow

```bash
# 1. Add some books
./library add-book -t "To Kill a Mockingbird" -a "Harper Lee"
./library add-book -t "1984" -a "George Orwell"
./library add-book -t "The Great Gatsby" -a "F. Scott Fitzgerald"

# 2. Add members
./library add-member -n "Alice Johnson"
./library add-member -n "Bob Smith"

# 3. View library stats
./library stats

# 4. Search for books
./library search -a "Orwell"

# 5. Borrow a book
./library borrow -b 1 -m 1

# 6. Check member's borrowed books
./library member-books -m 1

# 7. List all books (see availability status)
./library list-books

# 8. Return the book
./library return -b 1 -m 1

# 9. View updated stats
./library stats
```

## Database

The CLI uses SQLite and stores data in `library.db` in the same directory as the binary. The database is automatically created on first run.

To start fresh, simply delete the `library.db` file:

```bash
rm library.db
```
