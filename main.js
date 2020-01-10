var taskItemBox = document.querySelector('.task-item-box');
var taskItemInput = document.getElementById('task-item-input');
var taskTitleInput = document.getElementById('task-title-input')
var plusBtn = document.getElementById('add-task-btn');
var taskForm = document.querySelector('form');
var taskListBtn = document.getElementById('make-task-list-btn');
var noTasksMsg = document.getElementById('no-tasks-msg');
var tasksListsSection = document.querySelector('.task-lists-column');
var clearAllBtn = document.getElementById('clear-all-btn')

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
      <input type="checkbox"><p>${task.innerText}</p>
    </div>`;
  })
  var taskCard = `<div class="task-card">
    <h2 class="card-title">${taskTitleInput.value}</h2>
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
  tasksListsSection.insertAdjacentHTML('afterbegin', taskCard)
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
