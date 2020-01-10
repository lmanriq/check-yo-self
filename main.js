var taskItemBox = document.querySelector('.task-item-box');
var taskItemInput = document.getElementById('task-item-input');
var taskTitleInput = document.getElementById('task-title-input')
var plusBtn = document.getElementById('add-task-btn');
var taskForm = document.querySelector('form');
var taskListBtn = document.getElementById('make-task-list-btn');
var noTasksMsg = document.getElementById('no-tasks-msg');
var tasksListsSection = document.querySelector('.task-lists-column');
var clearAllBtn = document.getElementById('clear-all-btn');
var taskLists = [];

tasksListsSection.addEventListener('click', function() {
  changeCheckedStatus();
})

function changeCheckedStatus() {
  if (event.target.classList.contains('checkbox')) {
    console.log(event.target.id);
    taskLists.forEach(function(taskList) {
      taskList.tasks.forEach(function(task) {
        if (event.target.id === task.id) {
          task.completed = true;
        }
      })
      taskList.saveToStorage();
    })
    event.target.disabled = true;

  }
}

plusBtn.addEventListener('click', function() {
  addTaskItem();
  enableTaskListBtn();
})
taskItemBox.addEventListener('click', function() {
  deleteTaskItem(event)
})
taskItemInput.addEventListener('keyup', activatePlusBtn)
taskListBtn.addEventListener('click', function() {
  addTaskCard();
  addTasksToStorage();
});
taskForm.addEventListener('keyup', enableClearBtn)
clearAllBtn.addEventListener('click', clearForm)

disableAllButtons();

function clearForm() {
  taskForm.reset();
}

function enableClearBtn() {
  if (taskTitleInput.value || taskItemInput.value) {
    clearAllBtn.disabled = false;
  }
}

function enableTaskListBtn() {
  if (taskTitleInput.value && taskItemBox.hasChildNodes()) {
    taskListBtn.disabled = false;
  }
}

function disableAllButtons() {
  var buttons = document.querySelectorAll('button');
  buttons.forEach(function(button) {
    button.disabled = true;
  })
}

function addTaskCard() {
  noTasksMsg.remove();
  var allTasks = document.querySelectorAll('.task-p');
  var checklistHTML = '';
  allTasks.forEach(function(task){
    checklistHTML += `<div class="check-pair">
      <input class="checkbox" type="checkbox"><p>${task.innerText}</p>
    </div>`;
  });
  var taskCard = makeTaskCard(taskTitleInput.value, checklistHTML);
  tasksListsSection.insertAdjacentHTML('afterbegin', taskCard);
}

addTasksOnLoad();

function makeTaskCard(title, checklistHTML) {
  var taskCard = `<div class="task-card">
    <h2 class="card-title">${title}</h2>
    <div class="card-list-box">
    ${checklistHTML}
    </div>
    <div class="card-footer">
      <div class="urgent-box">
        <img src="assets/urgent.svg" alt="urgent icon">
        <p>URGENT</p>
      </div>
      <div class="delete-box">
        <img class="delete" src="assets/delete.svg" alt="delete button">
        <p>DELETE</p>
      </div>
    </div>
  </div>`
  return taskCard;
}

function addTasksOnLoad() {
  if (localStorage.getItem('task lists')) {
    noTasksMsg.remove();
    taskLists = JSON.parse(localStorage.getItem('task lists'));
    taskLists.forEach(function(taskList) {
      var listId = taskList.id;
      var listTasks = taskList.tasks;
      taskList = new ToDoList(listId, taskList.title, listTasks);
    })
    taskLists.forEach(function(taskList) {
      var checklistHTML = '';
      var taskItems = taskList.tasks;
      taskItems.forEach(function(task) {
        //replace existing tasks with newly instantiated tasks
        //Give input an ID that matches ID of input
        var taskId = task.id;
        task = new Task(taskId, task.content, task.completed);
        var checkedStatus = '';
        if (task.completed === true) {
          checkedStatus = `checked="checked"`
        }
        checklistHTML += `<div class="check-pair">
          <input id=${taskId} class="checkbox" type="checkbox" ${checkedStatus}><p>${task.content}</p>
        </div>`;
      })
      var taskCard = makeTaskCard(taskList.title, checklistHTML);
      tasksListsSection.insertAdjacentHTML('afterbegin', taskCard);
    })
  }
}

function addTasksToStorage() {
  var taskItems = [];
  var allTasks = document.querySelectorAll('.task-p');
  var id = new Date().valueOf();
  var toDo = new ToDoList(id, taskTitleInput.value);
  allTasks.forEach(function(task){
    id += 'a';
    taskItems.push(new Task(id, task.innerText, false));
  })
  toDo.tasks = taskItems;
  toDo.saveToStorage();
}

function activatePlusBtn() {
  if (taskItemInput.value) {
    plusBtn.disabled = false;
  } else {
    plusBtn.disabled = true;
  }
}

function addTaskItem() {
  var taskItemHTML = `<div class="item">
    <img class="delete" src="assets/delete.svg" alt="delete icon"><p class="task-p">${taskItemInput.value}</p>
  </div>`
  taskItemBox.insertAdjacentHTML('beforeend', taskItemHTML);
  taskItemInput.value = '';
  activatePlusBtn();
}

function deleteTaskItem(event) {
  if (event.target.classList.contains('delete')) {
    event.target.parentNode.remove();
  }
}
