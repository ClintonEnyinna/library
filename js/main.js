let myLibrary = [];
const table = document.querySelector('table');
const getTableErr = document.querySelector('#tb-err');
const getBookButton = document.querySelector('#add-book');
const getBookForm = document.querySelector('#book-form');
getBookForm.style.display = 'None';
const getUserErr = document.querySelector('#userinputerr');
const getDeleteBtn = document.querySelector('#book-delete');
const getEditBtn = document.querySelector('#book-edit');

const myLibraryData = JSON.parse(localStorage.getItem('myLibrary'));
if (myLibraryData) {
  myLibrary = myLibraryData;
}

function Book(title, author, pages, read = 'No') {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(title, author, pages) {
  const newBook = new Book(title, author, pages);
  myLibrary.push(newBook);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

getBookForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (
    getBookForm.elements[0].value !== ''
    && getBookForm.elements[1].value !== ''
    && getBookForm.elements[0].value !== ''
  ) {
    getUserErr.innerHTML = '';

    addBookToLibrary(
      getBookForm.elements[0].value,
      getBookForm.elements[1].value,
      getBookForm.elements[2].value,
    );
    getUserErr.innerHTML = 'Book added';
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    getUserErr.innerHTML = 'All Fields must not be empty';
  }
  getBookForm.elements[0].value = '';
  getBookForm.elements[1].value = '';
  getBookForm.elements[2].value = '';
});

getBookButton.addEventListener('click', () => {
  getBookForm.style.display = 'block';
});

function generateTableHead() {
  if (myLibrary.length < 1) {
    getTableErr.innerHTML = 'Database empty';
  } else {
    const thead = table.createTHead();
    const row = thead.insertRow();
    const data = Object.keys(myLibrary[0]);
    const thh = document.createElement('th');
    const headText = document.createTextNode('Operations');
    thh.appendChild(headText);
    row.appendChild(thh);
    data.forEach((key) => {
      const th = document.createElement('th');
      const text = document.createTextNode(key.toUpperCase());
      th.appendChild(text);
      row.appendChild(th);
    });
  }
}

let rowIndex = 0;
function getRowId() {
  rowIndex += 1;
  return rowIndex;
}

function generateTableContent() {
  const tbody = table.createTBody();

  myLibrary.forEach((element) => {
    const row = tbody.insertRow();
    row.innerHTML = `<input type="checkbox" class="myinput" id="${getRowId()}">`;
    Object.keys(element).forEach((key) => {
      if (key) {
        const cell = row.insertCell();
        const text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    });
  });
}

function render() {
  generateTableHead(table, myLibrary);
  generateTableContent(table, myLibrary);
}

getDeleteBtn.addEventListener('click', () => {
  const getMyInput = document.querySelectorAll('.myinput');
  for (let index = 0; index < getMyInput.length; index += 1) {
    if (getMyInput[index].checked) {
      const rowId = getMyInput[index].id;
      delete myLibrary[rowId - 1];
    }
  }
  const temp = myLibrary.filter((i) => i);

  localStorage.setItem('myLibrary', JSON.stringify(temp));
  window.location.reload();
});

getEditBtn.addEventListener('click', () => {
  const getMyInput = document.querySelectorAll('.myinput');
  for (let index = 0; index < getMyInput.length; index += 1) {
    if (getMyInput[index].checked) {
      const rowId = getMyInput[index].id;
      if (myLibrary[rowId - 1].read === 'Yes') {
        myLibrary[rowId - 1].read = 'No';
      } else {
        myLibrary[rowId - 1].read = 'Yes';
      }
    }
  }

  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  window.location.reload();
});

render(table, myLibrary);
