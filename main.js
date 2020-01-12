var taskItemBox = document.querySelector('.task-item-box');
var taskItemInput = document.getElementById('task-item-input');
var taskTitleInput = document.getElementById('task-title-input')
var plusBtn = document.getElementById('add-task-btn');
var taskForm = document.querySelector('form');
var taskListBtn = document.getElementById('make-task-list-btn');
var noTasksMsg = document.getElementById('no-tasks-msg');
var tasksListsSection = document.querySelector('.task-lists-column');
var clearAllBtn = document.getElementById('clear-all-btn');
var filterBtn = document.getElementById('filter-btn');
var taskLists = [];

filterBtn.addEventListener('click', filterByUrgency)

//
// var urgentTasks = [];
// for (var i = 0; i < taskLists.length; i++) {
//   var urgentBox = allTaskCards[i].querySelector('.urgent-box');
//   if (urgentBox.classList.contains('active')) {
//     urgentCards.push(allTaskCards[i]);
//   }
// }

// checkListHTML = '';
// console.log(card.tasks)
// // card.tasks.forEach(function(task) {
// //   if (task.completed === true) {
// //     checkedStatus = `checked="checked"`
// //   }
// //   checklistHTML += `<div class="check-pair">
// //     <input id=${task.id} class="checkbox" type="checkbox" ${checkedStatus}><p>${task.content}</p>
// //   </div>`;
// // })
// // makeTaskCard(card.id, card.title, checklistHTML)

function filterByUrgency() {
  var urgentTaskLists = [];
  for (var i = 0; i < taskLists.length; i++) {
    if (taskLists.urgent) {
      urgentTaskLists.push(taskLists[i]);
    }
  }
  tasksListsSection.innerHTML = '';

  populateCards(urgentTaskLists);
}

tasksListsSection.addEventListener('click', function(event) {
  changeCheckedStatus(event);
  deleteTaskCard(event);
  checkIfChecked();
  markUrgent(event);
  checkIfDeleteIsActive();
  checkIfUrgent();
  // addTaskListsToStorage(taskLists);
  // addTasksOnLoad();
})

function markUrgent(event) {
  if (event.target.classList.contains('urgent') && !event.target.classList.contains('active')) {
    event.target.classList.add('active');
    var targetCard = event.target.closest('.task-card');
    for (var i = 0; i < taskLists.length; i++) {
      if (taskLists[i].id == targetCard.id) {
        taskLists[i].updateToDo(taskLists[i].title, true);
        // taskLists[i].saveToStorage();
      }
    }
    console.log(taskLists);
    addTaskListsToStorage(taskLists);
  }
}


plusBtn.addEventListener('click', function() {
  addTaskItem();
  enableTaskListBtn();
})
taskItemBox.addEventListener('click', function(event) {
  deleteTaskItem(event);
})

taskItemInput.addEventListener('keyup', activatePlusBtn)
taskListBtn.addEventListener('click', function() {
  addTasksToStorage();
  clearForm();
  checkIfDeleteIsActive();
  checkIfUrgent();
});
taskForm.addEventListener('keyup', enableClearBtn)
clearAllBtn.addEventListener('click', clearForm)

disableAllButtons();
checkStorage();
addTasksOnLoad();
checkIfDeleteIsActive();
checkIfUrgent()

function checkIfChecked() {
  var allCheckBoxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < allCheckBoxes.length; i++) {
    if (allCheckBoxes[i].checked) {
      allCheckBoxes[i].disabled = true;
    }
  }
}

function addTaskListsToStorage(taskLists) {
  localStorage.setItem('task lists', JSON.stringify(taskLists));
}

function changeCheckedStatus(event) {
  if (event.target.classList.contains('checkbox')) {
    for (var i = 0; i < taskLists.length; i++) {
      for (var j = 0; j < taskLists[i].tasks.length; j++) {
        if (event.target.id === taskLists[i].tasks[j].id) {
          taskLists[i].updateTask(event.target.id);
          event.target.disabled = true;
        }
      }
    }
    // event.target.disabled = true;
  }
}

function clearForm() {
  taskForm.reset();
  taskItemBox.innerHTML = '';
  disableAllButtons();
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
  filterBtn.disabled = false;
}

// function addTaskCard(id) {
//   noTasksMsg.remove();
//   var allTaskItems = document.querySelectorAll('.task-p');
//   var checklistHTML = '';
//   allTaskItems.forEach(function(task){
//     checklistHTML += `<div class="check-pair">
//       <input class="checkbox" type="checkbox"><p>${task.innerText}</p>
//     </div>`;
//   });
//   var taskCard = makeTaskCard(id, taskTitleInput.value, checklistHTML);
//   tasksListsSection.insertAdjacentHTML('afterbegin', taskCard);
// }

function makeTaskCard(id, title, checklistHTML) {
  var taskCard = `<div id=${id} class="task-card">
    <h2 class="card-title">${title}</h2>
    <div class="card-list-box">
    ${checklistHTML}
    </div>
    <div class="card-footer">
      <div class="urgent urgent-box">
        <img class="urgent" src="assets/urgent.svg" alt="urgent icon">
        <p class="urgent">URGENT</p>
      </div>
      <button class="delete task-list-delete">
        <img class="delete delete-img" src="assets/delete.svg" alt="delete button">
        <p class="delete">DELETE</p>
      </button>
    </div>
  </div>`
  return taskCard;
}

function checkStorage() {
  if (localStorage.getItem('task lists') !== '[]' && localStorage.getItem('task lists') !== null) {
    noTasksMsg.remove();
    taskLists = JSON.parse(localStorage.getItem('task lists'));
    for (var g = 0; g < taskLists.length; g++) {
      taskLists[g] = new ToDoList(taskLists[g].id, taskLists[g].title, taskLists[g].urgent, taskLists[g].tasks);
    }
  }
}

function populateCards(taskLists) {
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
}

function addTasksOnLoad() {
  if (localStorage.getItem('task lists') !== '[]' && localStorage.getItem('task lists') !== null) {
    tasksListsSection.innerHTML = ''
    //can replace with populate cards
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
  }

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
  var toDo = new ToDoList(id, taskTitleInput.value, false, taskItems);
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

function checkIfNoMoreCards() {
  if (!tasksListsSection.innerHTML) {
    tasksListsSection.innerHTML = `<h3 id="no-tasks-msg">No tasks yet! Create a new task list to get started.</h3>`
  }
}

// function checkIfUrgent() {
//   var allTaskCards = document.querySelectorAll('.task-card');
//   for (var t = 0; t < allTaskCards.length; t++) {
//     var cardFooter = allTaskCards[t].childNodes[allTaskCards[t].childNodes.length - 2];
//     var urgentBox = cardFooter.childNodes[1];
//     var matched = '';
//     allTaskCards[t].id ===
//     for (var i = 0; i < taskLists.length; i++) {
//       if (taskLists[i].urgent === true) {
//
//       }
//     }
//   }
// }

function checkIfUrgent() {
  for (var i = 0; i < taskLists.length; i++) {
    if (taskLists[i].urgent === true) {
      var allTaskCards = document.querySelectorAll('.task-card');
      for (var j = 0; j < allTaskCards.length; j++) {
        if (taskLists[i].id == allTaskCards[j].id) {
          var urgentBox = allTaskCards[j].querySelector('.urgent-box');
          urgentBox.innerHTML = `<img class="urgent" src="assets/urgent-active.svg" alt="urgent icon">
          <p class="urgent">URGENT</p>`
          urgentBox.classList.add('active');
          allTaskCards[j].classList.add('urgent-card');
        }
      }
    }
  }
}

function checkIfDeleteIsActive() {
  var allTaskCards = document.querySelectorAll('.task-card');
  for (var t = 0; t < allTaskCards.length; t++) {
    var allChecked = true;
    var cardFooter = allTaskCards[t].childNodes[allTaskCards[t].childNodes.length - 2];
    var deleteBtn = cardFooter.childNodes[3];
    var cardList = allTaskCards[t].querySelector('.card-list-box')
    // first and last nodes are text
    for (var i = 1; i < cardList.childNodes.length - 1; i++) {
      //Select the checkbox input child node
      if (!cardList.childNodes[i].childNodes[1].checked) {
        allChecked = false;
      }
    }
    if (allChecked) {
      deleteBtn.disabled = false;
      deleteBtn.classList.add('active');
      deleteBtn.innerHTML = `<img class="delete delete-img" src="assets/delete-active.svg" alt="delete button">
      <p class="delete">DELETE</p>`
    } else {
      deleteBtn.disabled = true;
      deleteBtn.classList.remove('active');
      deleteBtn.innerHTML = `<img class="delete delete-img" src="assets/delete.svg" alt="delete button">
      <p class="delete">DELETE</p>`
    }
  }
}

function deleteTaskCard(event) {
  if (event.target.classList.contains('delete') && !event.target.closest('button').disabled) {
    var targetCard = event.target.closest('.task-card');
    for (var i = 0; i < taskLists.length; i++) {
      if (taskLists[i].id == targetCard.id) {
        targetCard.remove();
        taskLists[i].deleteFromStorage();
      }
    }
  }
  checkIfNoMoreCards();
}
