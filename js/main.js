let myLibrary = [
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    pages: "295",
    read: "no",
  },
];
let table = document.querySelector("table");

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
};

function addBookToLibrary(title, author, pages, read) {
  let newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
}

function render(table, myLibrary) {
  generateTableHead(table, myLibrary);
  generateTableContent(table, myLibrary);
}

function generateTableHead(table, myLibrary) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  let data = Object.keys(myLibrary[0]);
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key.toUpperCase());
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTableContent(table, myLibrary) {
  let tbody = table.createTBody();
  for (let element of myLibrary) {
    let row = tbody.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

render(table, myLibrary);
