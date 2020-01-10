var taskItemBox = document.querySelector('.task-item-box');
var taskItemInput = document.getElementById('task-item-input');
var plusBtn = document.getElementById('add-task-btn');
var taskForm = document.querySelector('form');
var taskListBtn = document.getElementById('make-task-list-btn');
var noTasksMsg = document.getElementById('no-tasks-msg');
var tasksListsSection = document.querySelector('.task-lists-column');

plusBtn.addEventListener('click', addTaskItem)
taskItemBox.addEventListener('click', function() {
  deleteTaskItem(event)
})
taskItemInput.addEventListener('keyup', activatePlusBtn)
taskListBtn.addEventListener('click', addTaskCard)

activatePlusBtn();

function addTaskCard() {
  var taskCard = `<div class="task-card">
    <h2 class="card-title">${}</h2>
    <div class="card-list-box">
      <div class="check-pair">
        <input type="checkbox" checked="checked"><p>Blah blah blah</p>
      </div>
      <div class="check-pair">
        <input type="checkbox"><p>Blah blah blah</p>
      </div>
      <div class="check-pair">
        <input type="checkbox"><p>Blah blah blah</p>
      </div>
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
  noTasksMsg.remove();
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
    <img class="delete" src="assets/delete.svg" alt="delete icon"><p>${taskItemInput.value}</p>
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
