// for merged promises
// import client from '../utils/client';
import { getSingleAuthor, getAuthorBooks, deleteSingleAuthor } from './authorData';
import { getSingleBook, deleteBook } from './bookData';

// const endpoint = client.databaseURL;

const getBookDetails = (firebaseKey) => new Promise((resolve, reject) => {
  getSingleBook(firebaseKey).then((bookObj) => {
    getSingleAuthor(bookObj.author_id).then((authorObject) => resolve({ ...bookObj, authorObject }));
  }).catch(reject);
});

const getAuthorDetails = (firebaseKey) => new Promise((resolve, reject) => {
  getSingleAuthor(firebaseKey).then((authorObject) => {
    getAuthorBooks(firebaseKey).then((booksArray) => resolve({ ...authorObject, booksArray }));
  }).catch(reject);
});

const deleteAuthorBooksRelationship = (firebaseKey) => new Promise((resolve, reject) => {
  getAuthorBooks(firebaseKey).then((authorBooksArray) => {
    const deleteBookPromises = authorBooksArray.map((book) => deleteBook(book.firebaseKey));

    Promise.all(deleteBookPromises).then(() => {
      deleteSingleAuthor(firebaseKey).then(resolve);
    });
  }).catch(reject);
});

export { getBookDetails, getAuthorDetails, deleteAuthorBooksRelationship };
