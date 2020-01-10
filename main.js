var taskItemBox = document.querySelector('.task-item-box');
var taskItemInput = document.getElementById('task-item-input');
var plusButton = document.getElementById('add-task-btn');

plusButton.addEventListener('click', addTaskItem)
taskItemBox.addEventListener('click', deleteTaskItem)

function addTaskItem() {
  var taskItemHTML = `<div class="item">
    <img src="assets/delete.svg" alt="delete icon"><p>${taskItemInput.value}</p>
  </div>`
  taskItemBox.insertAdjacentHTML('beforeend', taskItemHTML);
  taskItemInput.value = '';
}

function deleteTaskItem() {

}
