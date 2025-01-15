import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVp5CtsglGVw5Zjdbbf_dJZpGdgoTkPSI",
  authDomain: "authentication-12298.firebaseapp.com",
  projectId: "authentication-12298",
  storageBucket: "authentication-12298.firebasestorage.app",
  messagingSenderId: "414945602397",
  appId: "1:414945602397:web:992285ca199707cd1956b4",
  measurementId: "G-F2YC2XWHBW"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

// Assuming you have a way to determine if the user is admin
let isAdmin = false; // Replace with actual logic to determine if the user is an admin (e.g., after login)

// Example: For testing, you can set this to `true` or `false`
isAdmin = true; // Set to false to simulate a non-admin user

function displayBooks() {
  const bookTable = document.getElementById('book-table');
  const dbRef = ref(db, "Books");

  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      const books = snapshot.val();
      bookTable.innerHTML = `
        <tr>
          <th>Book Name</th>
          <th>ISBN</th>
          <th>Genre</th>
          <th>Author</th>
          <th>Actions</th>
        </tr>
      `;
      
      Object.keys(books).forEach((key) => {
        const book = books[key];
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.BookName}</td>
          <td>${book.ISBN}</td>
          <td>${book.Genre}</td>
          <td>${book.Author}</td>
          <td>
            <button onclick="editBook('${key}')">Edit</button>
            <button onclick="deleteBook('${key}')">Delete</button>
          </td>
        `;
        bookTable.appendChild(row);
      });
    }
  }).catch((error) => {
    console.error("Error fetching data:", error);
  });
}

// Edit Book
window.editBook = function (key) {
  window.location.href = `/dashboard?id=${key}`;
};

// Delete Book (Admin Only)
window.deleteBook = function (key) {
  if (isAdmin) {
    if (confirm("Are you sure you want to delete this book?")) {
      const bookRef = ref(db, `Books/${key}`);
      remove(bookRef)
        .then(() => {
          alert("Book deleted successfully.");
          console.log(`Book with key ${key} deleted.`);
          displayBooks();  // Refresh the list of books
        })
        .catch((error) => {
          console.error("Error deleting book:", error);
          alert("An error occurred. Please try again.");
        });
    }
  } else {
    alert("Only admin has access to delete books.");
  }
};

window.onload = displayBooks;
