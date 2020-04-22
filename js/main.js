let myLibrary = [];
let table = document.querySelector("table");
let getTableErr = document.querySelector("#tb-err");
let getBookButton = document.querySelector("#add-book");
let getBookForm = document.querySelector("#book-form");
getBookForm.style.display = "None";
let getUserErr = document.querySelector("#userinputerr");
let getDeleteBtn = document.querySelector("#book-delete");
let getEditBtn = document.querySelector("#book-edit");

const myLibraryData = JSON.parse(localStorage.getItem("myLibrary"));
if (myLibraryData) {
  myLibrary = myLibraryData;
}

getBookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (
    getBookForm.elements[0].value != "" &&
    getBookForm.elements[1].value != "" &&
    getBookForm.elements[0].value != ""
  ) {
    getUserErr.innerHTML = "";

    addBookToLibrary(
      getBookForm.elements[0].value,
      getBookForm.elements[1].value,
      getBookForm.elements[2].value
    );
    getUserErr.innerHTML = "Book added";
    setTimeout(function () {
      window.location.reload();
    }, 1000);
  } else {
    getUserErr.innerHTML = "All Fields must not be empty";
  }
  getBookForm.elements[0].value = "";
  getBookForm.elements[1].value = "";
  getBookForm.elements[2].value = "";
});

getBookButton.addEventListener("click", function (event) {
  event.preventDefault();
  getBookForm.style.display = "block";
});

function Book(title, author, pages, read = "No") {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Book.prototype.info = function () {
//   return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
// };

function addBookToLibrary(title, author, pages) {
  let newBook = new Book(title, author, pages);
  myLibrary.push(newBook);
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function render(table, myLibrary) {
  generateTableHead(table, myLibrary);
  generateTableContent(table, myLibrary);
}

function generateTableHead(table, myLibrary) {
  if (myLibrary.length < 1) {
    getTableErr.innerHTML = "Database empty";
  } else {
    let thead = table.createTHead();
    let row = thead.insertRow();
    let data = Object.keys(myLibrary[0]);
    let th = document.createElement("th");
    let text = document.createTextNode("Operations");
    th.appendChild(text);
    row.appendChild(th);
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key.toUpperCase());
      th.appendChild(text);
      row.appendChild(th);
    }
  }
}

function generateTableContent(table, myLibrary) {
  let tbody = table.createTBody();

  for (let element of myLibrary) {
    let row = tbody.insertRow();
    row.innerHTML =
      '<input type="checkbox" class="myinput" id="' + getRowId() + '">';
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

let rowIndex = 0;
function getRowId() {
  rowIndex += 1;
  return rowIndex;
}

getDeleteBtn.addEventListener("click", function (event) {
  let getMyInput = document.querySelectorAll(".myinput");
  for (let index = 0; index < getMyInput.length; index++) {
    if (getMyInput[index].checked) {
      let rowId = getMyInput[index].id;
      delete myLibrary[rowId - 1];
    }
  }
  let temp = myLibrary.filter((i) => i);

  localStorage.setItem("myLibrary", JSON.stringify(temp));
  window.location.reload();
});

getEditBtn.addEventListener("click", function (event) {
  let getMyInput = document.querySelectorAll(".myinput");
  for (let index = 0; index < getMyInput.length; index++) {
    if (getMyInput[index].checked) {
      let rowId = getMyInput[index].id;
      if (myLibrary[rowId - 1].read == "Yes") {
        myLibrary[rowId - 1].read = "No" 
      }else{
        myLibrary[rowId - 1].read = "Yes"
      } 

      
      
    }
  }

  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  window.location.reload();
});

render(table, myLibrary);
