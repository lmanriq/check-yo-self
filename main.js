var taskItemBox = document.querySelector('.task-item-box');
var taskItemInput = document.getElementById('task-item-input');
var plusBtn = document.getElementById('add-task-btn');

plusBtn.addEventListener('click', addTaskItem)
taskItemBox.addEventListener('click', function() {
  deleteTaskItem(event)
})

taskItemInput.addEventListener('keyup', activatePlusBtn)

activatePlusBtn();

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
