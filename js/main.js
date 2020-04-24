let myLibrary = [];
const table = document.querySelector('table');
const getTableErr = document.querySelector('#tb-err');
const getBookButton = document.querySelector('#add-book');
const getBookForm = document.querySelector('#book-form');
const getUserErr = document.querySelector('#userinputerr');

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

function clearFields() {
  for (let i = 0; i < getBookForm.length - 1; i += 1) {
    getBookForm.elements[i].value = '';
  }
}

function flash(msg, style) {
  getTableErr.innerHTML = msg;
  getTableErr.className = `text-${style}`;
  setTimeout(() => {
    getTableErr.innerHTML = '&nbsp;';
  }, 1500);
}

getBookButton.addEventListener('click', () => {
  getBookForm.style.display = 'block';
  getBookButton.style.display = 'none';
});

function generateTableHead() {
  if (myLibrary != null && myLibrary.length < 1) {
    flash('Database empty!', 'danger');
  } else {
    const thead = table.createTHead();
    const row = thead.insertRow();
    const data = Object.keys(myLibrary[0]);
    data.forEach((key) => {
      const th = document.createElement('th');
      const text = document.createTextNode(key.toUpperCase());
      th.appendChild(text);
      row.appendChild(th);
    });
    const lastTableHeader = document.createElement('th');
    const action = document.createTextNode('ACTIONS');
    lastTableHeader.appendChild(action);
    row.appendChild(lastTableHeader);
    getTableErr.innerHTML = '';
  }
}

function generateTableContent() {
  const tbody = table.createTBody();
  let rowIndex = 0;

  myLibrary.forEach((element) => {
    const row = tbody.insertRow();
    Object.keys(element).forEach((key) => {
      if (key) {
        const cell = row.insertCell();
        const text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    });
    const cell = row.insertCell();

    const btnDelete = document.createElement('button');
    const btnEdit = document.createElement('button');

    cell.appendChild(btnEdit);
    cell.appendChild(btnDelete);

    btnDelete.innerHTML = 'Delete';
    btnDelete.classList.add('btn', 'btn-danger', 'ml-2');
    btnDelete.setAttribute('data-delete', `${(rowIndex += 1)}`);

    btnEdit.innerHTML = 'Toggle Read';
    btnEdit.classList.add('btn', 'btn-warning');
    btnEdit.setAttribute('data-edit', `${rowIndex}`);
  });
}

function render() {
  table.innerHTML = '';
  generateTableHead(table, myLibrary);
  generateTableContent(table, myLibrary);

  const getDeleteBtns = document.querySelectorAll('[data-delete]');
  const getEditBtns = document.querySelectorAll('[data-edit]');

  function deleteRow(e) {
    const index = e.target.getAttribute('data-delete');

    myLibrary.splice(index - 1, 1);
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    render();
    flash('Book successfully deleted!', 'success');
  }

  function editRow(e) {
    const index = e.target.getAttribute('data-edit');

    if (myLibrary[index - 1].read === 'Yes') {
      myLibrary[index - 1].read = 'No';
    } else {
      myLibrary[index - 1].read = 'Yes';
    }
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
    render();
    flash('You changed read status!', 'primary');
  }

  function addClickEventToBtn(getBtns, action) {
    [...getBtns].forEach((btn) => {
      if (action === 'delete') btn.addEventListener('click', deleteRow);
      else btn.addEventListener('click', editRow);
    });
  }

  addClickEventToBtn(getDeleteBtns, 'delete');
  addClickEventToBtn(getEditBtns, 'edit');
}

getBookForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (
    getBookForm.elements[0].value !== '' &&
    getBookForm.elements[1].value !== '' &&
    getBookForm.elements[2].value !== ''
  ) {
    getUserErr.innerHTML = '';
    addBookToLibrary(
      getBookForm.elements[0].value,
      getBookForm.elements[1].value,
      getBookForm.elements[2].value
    );
    render();
    getBookForm.style.display = 'none';
    getBookButton.style.display = 'block';
    flash('New Book Added!', 'success');
    clearFields();
  } else {
    getUserErr.innerHTML = 'Fields must not be empty!';
  }
});

render(table, myLibrary);
