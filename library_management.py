import json
import os
from datetime import datetime, timedelta

class Library:
    def __init__(self):
        self.books_file = "books.json"
        self.members_file = "members.json"
        self.transactions_file = "transactions.json"
        self.load_data()

    def load_data(self):
        # Load books
        if os.path.exists(self.books_file):
            with open(self.books_file, 'r') as f:
                self.books = json.load(f)
        else:
            self.books = []

        # Load members
        if os.path.exists(self.members_file):
            with open(self.members_file, 'r') as f:
                self.members = json.load(f)
        else:
            self.members = []

        # Load transactions
        if os.path.exists(self.transactions_file):
            with open(self.transactions_file, 'r') as f:
                self.transactions = json.load(f)
        else:
            self.transactions = []

    def save_data(self):
        with open(self.books_file, 'w') as f:
            json.dump(self.books, f, indent=4)
        with open(self.members_file, 'w') as f:
            json.dump(self.members, f, indent=4)
        with open(self.transactions_file, 'w') as f:
            json.dump(self.transactions, f, indent=4)

    def add_book(self, title, author, isbn, quantity):
        book = {
            'title': title,
            'author': author,
            'isbn': isbn,
            'quantity': quantity,
            'available': quantity
        }
        self.books.append(book)
        self.save_data()
        return f"Book '{title}' added successfully!"

    def remove_book(self, isbn):
        for book in self.books:
            if book['isbn'] == isbn:
                self.books.remove(book)
                self.save_data()
                return f"Book with ISBN {isbn} removed successfully!"
        return "Book not found!"

    def add_member(self, name, member_id):
        member = {
            'name': name,
            'member_id': member_id,
            'books_borrowed': []
        }
        self.members.append(member)
        self.save_data()
        return f"Member '{name}' added successfully!"

    def remove_member(self, member_id):
        for member in self.members:
            if member['member_id'] == member_id:
                if member['books_borrowed']:
                    return "Cannot remove member with borrowed books!"
                self.members.remove(member)
                self.save_data()
                return f"Member with ID {member_id} removed successfully!"
        return "Member not found!"

    def borrow_book(self, member_id, isbn):
        # Find member
        member = next((m for m in self.members if m['member_id'] == member_id), None)
        if not member:
            return "Member not found!"

        # Find book
        book = next((b for b in self.books if b['isbn'] == isbn), None)
        if not book:
            return "Book not found!"

        if book['available'] <= 0:
            return "Book not available!"

        # Check if member already borrowed this book
        if isbn in member['books_borrowed']:
            return "Member already borrowed this book!"

        # Update book availability
        book['available'] -= 1
        member['books_borrowed'].append(isbn)

        # Record transaction
        transaction = {
            'member_id': member_id,
            'isbn': isbn,
            'borrow_date': datetime.now().strftime('%Y-%m-%d'),
            'return_date': (datetime.now() + timedelta(days=14)).strftime('%Y-%m-%d'),
            'returned': False
        }
        self.transactions.append(transaction)
        self.save_data()
        return f"Book borrowed successfully! Return by {transaction['return_date']}"

    def return_book(self, member_id, isbn):
        # Find member
        member = next((m for m in self.members if m['member_id'] == member_id), None)
        if not member:
            return "Member not found!"

        # Find book
        book = next((b for b in self.books if b['isbn'] == isbn), None)
        if not book:
            return "Book not found!"

        if isbn not in member['books_borrowed']:
            return "Member hasn't borrowed this book!"

        # Update book availability
        book['available'] += 1
        member['books_borrowed'].remove(isbn)

        # Update transaction
        for transaction in self.transactions:
            if (transaction['member_id'] == member_id and 
                transaction['isbn'] == isbn and 
                not transaction['returned']):
                transaction['returned'] = True
                transaction['actual_return_date'] = datetime.now().strftime('%Y-%m-%d')
                break

        self.save_data()
        return "Book returned successfully!"

    def search_books(self, query):
        results = []
        query = query.lower()
        for book in self.books:
            if (query in book['title'].lower() or 
                query in book['author'].lower() or 
                query in book['isbn'].lower()):
                results.append(book)
        return results

    def display_books(self):
        if not self.books:
            return "No books in the library!"
        return self.books

    def display_members(self):
        if not self.members:
            return "No members in the library!"
        return self.members

def main():
    library = Library()
    
    while True:
        print("\nLibrary Management System")
        print("1. Add Book")
        print("2. Remove Book")
        print("3. Add Member")
        print("4. Remove Member")
        print("5. Borrow Book")
        print("6. Return Book")
        print("7. Search Books")
        print("8. Display All Books")
        print("9. Display All Members")
        print("0. Exit")
        
        choice = input("\nEnter your choice: ")
        
        if choice == '1':
            title = input("Enter book title: ")
            author = input("Enter author name: ")
            isbn = input("Enter ISBN: ")
            quantity = int(input("Enter quantity: "))
            print(library.add_book(title, author, isbn, quantity))
            
        elif choice == '2':
            isbn = input("Enter ISBN of book to remove: ")
            print(library.remove_book(isbn))
            
        elif choice == '3':
            name = input("Enter member name: ")
            member_id = input("Enter member ID: ")
            print(library.add_member(name, member_id))
            
        elif choice == '4':
            member_id = input("Enter member ID to remove: ")
            print(library.remove_member(member_id))
            
        elif choice == '5':
            member_id = input("Enter member ID: ")
            isbn = input("Enter ISBN of book to borrow: ")
            print(library.borrow_book(member_id, isbn))
            
        elif choice == '6':
            member_id = input("Enter member ID: ")
            isbn = input("Enter ISBN of book to return: ")
            print(library.return_book(member_id, isbn))
            
        elif choice == '7':
            query = input("Enter search query (title/author/ISBN): ")
            results = library.search_books(query)
            if results:
                for book in results:
                    print(f"Title: {book['title']}, Author: {book['author']}, ISBN: {book['isbn']}, Available: {book['available']}")
            else:
                print("No books found!")
                
        elif choice == '8':
            books = library.display_books()
            if isinstance(books, str):
                print(books)
            else:
                for book in books:
                    print(f"Title: {book['title']}, Author: {book['author']}, ISBN: {book['isbn']}, Available: {book['available']}")
                    
        elif choice == '9':
            members = library.display_members()
            if isinstance(members, str):
                print(members)
            else:
                for member in members:
                    print(f"Name: {member['name']}, ID: {member['member_id']}, Books Borrowed: {len(member['books_borrowed'])}")
                    
        elif choice == '0':
            print("Thank you for using the Library Management System!")
            break
            
        else:
            print("Invalid choice! Please try again.")

if __name__ == "__main__":
    main() 