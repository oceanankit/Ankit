# Library Management System

A simple library management system built with Python that allows you to manage books, members, and borrowing operations.

## Features

- Book Management
  - Add new books
  - Remove books
  - Search books by title, author, or ISBN
  - Display all books
  - Track book availability

- Member Management
  - Add new members
  - Remove members
  - Display all members
  - Track borrowed books

- Borrowing System
  - Borrow books
  - Return books
  - Track due dates
  - Prevent multiple borrowings of the same book
  - Prevent borrowing when books are unavailable

## Requirements

- Python 3.x
- No external dependencies required

## How to Run

1. Make sure you have Python installed on your system
2. Download or clone this repository
3. Open a terminal/command prompt in the project directory
4. Run the program using:
   ```
   python library_management.py
   ```

## Usage

The program provides a simple menu-driven interface. Here's what each option does:

1. **Add Book**: Add a new book to the library with title, author, ISBN, and quantity
2. **Remove Book**: Remove a book from the library using its ISBN
3. **Add Member**: Add a new library member with name and member ID
4. **Remove Member**: Remove a member from the system (only if they have no borrowed books)
5. **Borrow Book**: Allow a member to borrow a book
6. **Return Book**: Process book returns
7. **Search Books**: Search for books by title, author, or ISBN
8. **Display All Books**: Show all books in the library
9. **Display All Members**: Show all library members
0. **Exit**: Close the program

## Data Storage

The program stores all data in JSON files:
- `books.json`: Stores book information
- `members.json`: Stores member information
- `transactions.json`: Stores borrowing history

## Notes

- The system automatically saves all changes to JSON files
- Books can be borrowed for 14 days
- Members cannot borrow the same book multiple times
- Members cannot be removed if they have borrowed books
- The system tracks book availability and prevents over-borrowing 