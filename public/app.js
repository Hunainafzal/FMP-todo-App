var firebaseConfig = {
  apiKey: "AIzaSyBU-M1FEHeSJTglYXGQ49kxlIu87CdNPWE",
  authDomain: "fmp-todo-app-6d20f.firebaseapp.com",
  projectId: "fmp-todo-app-6d20f",
  storageBucket: "fmp-todo-app-6d20f.appspot.com",
  messagingSenderId: "1049638319976",
  appId: "1:1049638319976:web:6c2afb814d47a37a4688dd"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();





var todoForm = document.getElementById('todo-form');
var todoInput = document.getElementById('todo-input');
var todoList = document.getElementById('todo-list');

function renderTodoItem(todoId, todoText) {
  var li = document.createElement('li');
  li.id = todoId;

  var span = document.createElement('span');
  span.textContent = todoText;
  li.appendChild(span);

  var editButton = document.createElement('button');
  editButton.classList.add('edit-button');
  editButton.innerHTML = "<i class='bx bxs-edit-alt'></i>";
  editButton.addEventListener('click', function() {
    editTodoItem(todoId, todoText);
  });
  li.appendChild(editButton);

  var deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', function() {
    deleteTodoItem(todoId);
  });
  li.appendChild(deleteButton);

  todoList.appendChild(li);
}


function addTodoItem(todoText) {
  var newTodoRef = database.ref('todos').push();
  newTodoRef.set({
    text: todoText
  });
}



function editTodoItem(todoId, currentText) {
  var updatedText = prompt('Edit the task:', currentText);
  if (updatedText && updatedText.trim() !== '') {
    database.ref('todos').child(todoId).update({
      text: updatedText
    });
  }
}

function deleteTodoItem(todoId) {
  database.ref('todos').child(todoId).remove();
}

todoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  var todoText = todoInput.value.trim();
  if (todoText !== '') {
    addTodoItem(todoText);
    todoInput.value = '';
  }
});

database.ref('todos').on('child_added', function(snapshot) {
  var todoId = snapshot.key;
  var todoText = snapshot.val().text;
  renderTodoItem(todoId, todoText);
});

database.ref('todos').on('child_changed', function(snapshot) {
  var todoId = snapshot.key;
  var todoItem = document.getElementById(todoId);
  if (todoItem) {
    var span = todoItem.querySelector('span');
    span.textContent = snapshot.val().text;
  }
});

database.ref('todos').on('child_removed', function(snapshot) {
  var todoId = snapshot.key;
  var todoItem = document.getElementById(todoId);
  if (todoItem) {
    todoItem.remove();
  }
});
