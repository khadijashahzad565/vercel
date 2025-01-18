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

// Function to dynamically determine if the user is admin
function checkAdminStatus() {
  return new Promise((resolve, reject) => {
    const userEmail = sessionStorage.getItem("userEmail"); // Assume the user's email is stored after login
    if (!userEmail) {
      resolve(false); // Default to non-admin if no email is found
      return;
    }

    const adminEmailRef = ref(db, "Admins");
    get(adminEmailRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const adminEmails = Object.values(snapshot.val());
          resolve(adminEmails.includes(userEmail));
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
        reject(error);
      });
  });
}

// Display Books
function displayBooks() {
  const bookTable = document.getElementById("book-table");
  const dbRef = ref(db, "Books");

  get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const books = snapshot.val();
        bookTable.innerHTML = `
          <thead class="table-dark">
            <tr>
              <th scope="col">Book Name</th>
              <th scope="col">ISBN</th>
              <th scope="col">Genre</th>
              <th scope="col">Author</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        `;

        const tbody = bookTable.querySelector("tbody");

        Object.keys(books).forEach((key) => {
          const book = books[key];
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${book.BookName}</td>
            <td>${book.ISBN}</td>
            <td>${book.Genre}</td>
            <td>${book.Author}</td>
            <td>
              <button class="btn btn-warning btn-sm me-2" onclick="editBook('${key}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteBook('${key}')">Delete</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      } else {
        bookTable.innerHTML = `
          <div class="alert alert-info" role="alert">
            No books available at the moment.
          </div>
        `;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Edit Book
window.editBook = function (key) {
  window.location.href = `/dashboard?id=${key}`;
};

// Delete Book (Admin Only)
window.deleteBook = async function (key) {
  try {
    // Check admin status before allowing deletion
    const isAdmin = await checkAdminStatus(); 
    if (!isAdmin) {
      alert("Only admin has access to delete books.");
      return; // Exit if not an admin
    }

    if (confirm("Are you sure you want to delete this book?")) {
      const bookRef = ref(db, `Books/${key}`);
      await remove(bookRef); // Remove the book from the database
      alert("Book deleted successfully.");
      displayBooks(); // Refresh the displayed books
    }
  } catch (error) {
    // Unified error handling
    console.error("An error occurred:", error);
    alert("An error occurred. Please try again.");
  }
};

window.onload = displayBooks;
