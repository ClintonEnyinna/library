let myLibrary = [];
const table = document.querySelector('table');
const getTableErr = document.querySelector('#tb-err');
const getBookButton = document.querySelector('#add-book');
const getBookForm = document.querySelector('#book-form');
const getUserErr = document.querySelector('#userinputerr');
const getEditBtn = document.querySelector('#book-edit');

myLibrary = JSON.parse(localStorage.getItem('myLibrary'));

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
  for (let i = 0; i < 3; i += 1) {
    getBookForm.elements[i].value = '';
  }
}

function flash(msg, style) {
  getTableErr.innerHTML = msg;
  getTableErr.className = `text-${style}`;
  setTimeout((_) => {
    getTableErr.innerHTML = '&nbsp;';
  }, 1500);
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

getBookButton.addEventListener('click', () => {
  getBookForm.style.display = 'block';
  getBookButton.style.display = 'none';
});

function generateTableHead() {
  if (myLibrary.length < 1) {
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

function addClickEventToBtn(getDeleteBtns, action) {
  [...getDeleteBtns].forEach((btn) => {
    if (action === 'delete') btn.addEventListener('click', deleteRow);
    else btn.addEventListener('click', editRow);
  });
}

function deleteRow(e) {
  let index = e.target.getAttribute('data-delete');

  myLibrary.splice(index - 1, 1);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  render();
  flash('Book successfully deleted!', 'success');
}

function editRow(e) {
  let index = e.target.getAttribute('data-edit');

  if (myLibrary[index - 1].read === 'Yes') {
    myLibrary[index - 1].read = 'No';
  } else {
    myLibrary[index - 1].read = 'Yes';
  }
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  render();
  flash('You changed read status!', 'primary');
}

function render() {
  table.innerHTML = '';
  generateTableHead(table, myLibrary);
  generateTableContent(table, myLibrary);

  let getDeleteBtns = document.querySelectorAll('[data-delete]');
  let getEditBtns = document.querySelectorAll('[data-edit]');

  addClickEventToBtn(getDeleteBtns, 'delete');
  addClickEventToBtn(getEditBtns, 'edit');
}

render(table, myLibrary);
