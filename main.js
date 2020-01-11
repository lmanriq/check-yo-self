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
  addTaskListsToStorage();
  deleteTaskCard(event);
  checkIfChecked();
  // addTasksOnLoad();
})

function checkIfChecked() {
  var allCheckBoxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < allCheckBoxes.length; i++) {
    if (allCheckBoxes[i].checked) {
      allCheckBoxes[i].disabled = true;
    }
  }
}

function addTaskListsToStorage() {
  localStorage.setItem('task lists', JSON.stringify(taskLists));
}

function changeCheckedStatus() {
  if (event.target.classList.contains('checkbox')) {
    console.log(event.target.id);
    // var newTasksList;
    // for (var i = 0; i < taskLists.length; i++) {
    //   for (var j = 0; j < taskLists[i].tasks.length; j++) {
    //     taskLists[i].tasks[j].updateTask(event.target.id, taskLists[i].tasks[j].content, taskLists[i].tasks[j].completed)
    //   }
    // }

    for (var i = 0; i < taskLists.length; i++) {
      for (var j = 0; j < taskLists[i].tasks.length; j++) {
        if (event.target.id === taskLists[i].tasks[j].id) {
          console.log('howdy')
          taskLists[i].updateTask(event.target.id);
          event.target.disabled = true;
        }
      }
    }
    // taskLists.forEach(function(taskList) {
    //   taskList.tasks.forEach(function(task) {
    //     if (event.target.id === task.id) {
    //       task.completed = true;
    //     }
    //
    //   })
      //The checked status is working, but if I use the code below, I get duplicates
      //of all of my cards
      // taskList.saveToStorage();
    // })
    // taskLists = newTasksList;
    //taskLists.push(this);
    // window.localStorage.setItem('task lists', JSON.stringify(taskLists));
    event.target.disabled = true;
  }
}

plusBtn.addEventListener('click', function() {
  addTaskItem();
  enableTaskListBtn();
})
taskItemBox.addEventListener('click', function() {
  deleteTaskItem(event);
})

taskItemInput.addEventListener('keyup', activatePlusBtn)
taskListBtn.addEventListener('click', function() {
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

function addTaskCard(id) {
  noTasksMsg.remove();
  var allTaskItems = document.querySelectorAll('.task-p');
  var checklistHTML = '';
  allTaskItems.forEach(function(task){
    checklistHTML += `<div class="check-pair">
      <input class="checkbox" type="checkbox"><p>${task.innerText}</p>
    </div>`;
  });

  // var checklistHTML = '';
  // for (var i = 0; i < allTaskItems.length; i++) {
  //   var taskItems = allTaskItems[i].tasks;
  //   for (var j = 0; j < taskItems.length; j++) {
  //     var taskId = taskItems[j].id;
  //     taskItems[j] = new Task(taskId, taskItems[j].content, taskItems[j].completed);
  //     var checkedStatus = '';
  //     if (taskItems[j].completed === true) {
  //       checkedStatus = `checked="checked"`
  //     }
  //     checklistHTML += `<div class="check-pair">
  //       <input id=${taskId} class="checkbox" type="checkbox" ${checkedStatus}><p>${taskItems[j].content}</p>
  //     </div>`;
  //   }
  //   var taskCard = makeTaskCard(taskLists[i].id, taskLists[i].title, checklistHTML);
  //   tasksListsSection.insertAdjacentHTML('afterbegin', taskCard);
  //   checkIfChecked();
  // }

  var taskCard = makeTaskCard(id, taskTitleInput.value, checklistHTML);
  tasksListsSection.insertAdjacentHTML('afterbegin', taskCard);
}

checkStorage();
addTasksOnLoad();


function makeTaskCard(id, title, checklistHTML) {
  var taskCard = `<div id=${id} class="task-card">
    <h2 class="card-title">${title}</h2>
    <div class="card-list-box">
    ${checklistHTML}
    </div>
    <div class="card-footer">
      <div class="urgent-box">
        <img src="assets/urgent.svg" alt="urgent icon">
        <p>URGENT</p>
      </div>
      <div class="delete task-list-delete">
        <img class="delete" src="assets/delete.svg" alt="delete button">
        <p>DELETE</p>
      </div>
    </div>
  </div>`
  return taskCard;
}

function checkStorage() {
  if (localStorage.getItem('task lists')) {
    noTasksMsg.remove();
    taskLists = JSON.parse(localStorage.getItem('task lists'));
    for (var g = 0; g < taskLists.length; g++) {
      var listId = taskLists[g].id;
      var listTasks = taskLists[g].tasks;
      taskLists[g] = new ToDoList(listId, taskLists[g].title, listTasks);
    }
  }
}

function addTasksOnLoad() {
  // if (localStorage.getItem('task lists')) {
  //   noTasksMsg.remove();
  //   taskLists = JSON.parse(localStorage.getItem('task lists'));
  //   for (var g = 0; g < taskLists.length; g++) {
  //     var listId = taskLists[g].id;
  //     var listTasks = taskLists[g].tasks;
  //     taskLists[g] = new ToDoList(listId, taskLists[g].title, listTasks);
  //   }
    if (localStorage.getItem('task lists')) {
      tasksListsSection.innerHTML = ''
    }
    for (var i = 0; i < taskLists.length; i++) {
      var checklistHTML = '';
      var taskItems = taskLists[i].tasks;
      for (var j = 0; j < taskItems.length; j++) {
        var taskId = taskItems[j].id;
        taskItems[j] = new Task(taskId, taskItems[j].content, taskItems[j].completed);
        var checkedStatus = '';
        if (taskItems[j].completed === true) {
          checkedStatus = `checked="checked"`
        }
        checklistHTML += `<div class="check-pair">
          <input id=${taskId} class="checkbox" type="checkbox" ${checkedStatus}><p>${taskItems[j].content}</p>
        </div>`;
      }
      var taskCard = makeTaskCard(taskLists[i].id, taskLists[i].title, checklistHTML);
      tasksListsSection.insertAdjacentHTML('afterbegin', taskCard);
      checkIfChecked();
    }
  // }
}

function addTasksToStorage() {
  var taskItems = [];
  var allTasks = document.querySelectorAll('.task-p');
  var id = new Date().valueOf();
  var taskId = id;
  allTasks.forEach(function(task){
    taskId += 'a';
    taskItems.push(new Task(taskId, task.innerText, false));
  })
  var toDo = new ToDoList(id, taskTitleInput.value, taskItems);
  toDo.saveToStorage();
  // addTaskCard(id);
  addTasksOnLoad();
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

function deleteTaskCard(event) {
  if (event.target.classList.contains('delete')) {
    var targetCard = event.target.closest('.task-card');
    for (var i = 0; i < taskLists.length; i++) {
      if (taskLists[i].id == targetCard.id) {
        targetCard.remove();
        taskLists[i].deleteFromStorage();
      }
    }
  }
}
