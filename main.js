var clearAllBtn = document.getElementById('clear-all-btn');
var filterBtn = document.getElementById('filter-btn');
var plusBtn = document.getElementById('add-task-btn');
var searchBar = document.getElementById('search-bar');
var taskForm = document.querySelector('form');
var taskItemBox = document.querySelector('.task-item-box');
var taskItemInput = document.getElementById('task-item-input');
var taskListBtn = document.getElementById('make-task-list-btn');
var taskLists = [];
var tasksListsSection = document.querySelector('.task-lists-column');
var taskTitleInput = document.getElementById('task-title-input')

fireOnLoad();

clearAllBtn.addEventListener('click', clearForm);
filterBtn.addEventListener('click', filterByUrgency);
plusBtn.addEventListener('click', function() {
  addTaskItem();
  enableTaskListBtn();
});
searchBar.addEventListener('keyup', function() {
  searchTasks();
  searchUrgentTasks();
});
taskForm.addEventListener('keyup', enableClearBtn);
taskItemBox.addEventListener('click', function(event) {
  deleteTaskItem(event);
});
taskItemInput.addEventListener('keyup', activatePlusBtn);
taskListBtn.addEventListener('click', function() {
  addTasksToStorage();
  checkIfDeleteIsActive();
  checkIfUrgent();
});
tasksListsSection.addEventListener('click', function(event) {
  changeTaskItemClick(event);
  changeCheckedStatus(event);
  deleteTaskCard(event);
  checkIfChecked();
  checkIfDeleteIsActive();
  activateSecondPlusBtn(event);
  markUrgent(event);
  checkIfUrgent();
  addTaskListsToStorage(taskLists);
});
tasksListsSection.addEventListener('keyup', function() {
  changeTaskItemEnter(event);
});

function activatePlusBtn() {
  plusBtn.disabled = !taskItemInput.value
}

function activateSecondPlusBtn(event) {
  var targetCard = event.target.closest('.task-card');
  var inputField = targetCard.querySelector('.item-input-2');
  if (event.target.classList.contains('add-button-2') && inputField.value) {
    function findList(list) {
      return list.id == targetCard.id;
    }
    var targetList = taskLists.find(findList);
    var addTaskBtn = targetCard.querySelector('.add-button-2');
    var cardBox = targetCard.querySelector('.card-list-box')
    var listLength = cardBox.childNodes.length - 2;
    addNewTaskItem(targetCard, targetList, inputField, cardBox, listLength);
  }
}

function activateUrgentIcon(list, card) {
  if (list.id == card.id) {
    var urgentBox = card.querySelector('.urgent-box');
    urgentBox.innerHTML = `<img class="urgent" src="assets/urgent-active.svg" alt="urgent icon">
    <p class="urgent">URGENT</p>`
    urgentBox.classList.add('active');
    card.classList.add('urgent-card');
  }
}

function addNewTaskItem(targetCard, targetList, inputField, cardBox, listLength) {
  var newItem = inputField.value;
  var newId = targetCard.id;
  for (var i = 0; i <= listLength; i ++) {
    newId += 'a';
  }
  targetList.tasks.push(new Task(newId, newItem, false))
  var newHTML = `<div class="check-pair">
    <input id=${newId} class="checkbox" type="checkbox"><input id="${newId}b" class="item-inputs" type="text" value="${newItem}">
  </div>`;
  cardBox.insertAdjacentHTML('beforeend', newHTML);
  inputField.value = '';
}

function addTaskItem() {
  var taskItemHTML = `<div class="item">
    <img class="delete" src="assets/delete.svg" alt="delete icon"><p class="task-p">${taskItemInput.value}</p>
  </div>`
  taskItemBox.insertAdjacentHTML('beforeend', taskItemHTML);
  taskItemInput.value = '';
  activatePlusBtn();
}

function addTaskListsToStorage(taskLists) {
  localStorage.setItem('task lists', JSON.stringify(taskLists));
}

function addTasksOnLoad() {
  if (localStorage.getItem('task lists') !== '[]' && localStorage.getItem('task lists') !== null) {
    populateCards(taskLists);
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
  clearForm();
  addTasksOnLoad();
}

function changeCheckedStatus(event) {
  if (event.target.classList.contains('checkbox')) {
    var targetCard = event.target.closest('.task-card');
    function findList(list) {
      return list.id == targetCard.id;
    }
    var targetList = taskLists.find(findList);
    targetList.tasks.forEach(function(task) {
      updateCheckedData(targetList, task)
    })
  }
}

function changeInputValue(event) {
  var targetCard = event.target.closest('.task-card');
  var cardTitle = targetCard.querySelector('.card-title');
  function findList(list) {
    return list.id == targetCard.id;
  }
  var targetList = taskLists.find(findList);
  var targetIndex = taskLists.indexOf(targetList);
  var newTasks = taskLists[targetIndex].tasks;
  for (var i = 0; i < newTasks.length; i++) {
    newTasks[i].content = targetCard.querySelector(`[id='${targetList.tasks[i].id}b']`).value
  }
  taskLists[targetIndex].updateToDo(cardTitle.value, taskLists[targetIndex].urgent)
  taskLists[targetIndex].updateTask('', 'content', newTasks)
  addTaskListsToStorage(taskLists);
}

function changeTaskItemEnter(event) {
  if ((event.target.classList.contains('card-title') || event.target.classList.contains('item-inputs')) && event.keyCode === 13) {
    changeInputValue(event);
  }
}

function changeTaskItemClick(event) {
  if (event.target.tagName !== 'INPUT' && !event.target.classList.contains('delete') && event.target.closest('.task-card')) {
    changeInputValue(event)
  }
}

function checkIfAllChecked(allChecked, btn) {
  if (allChecked) {
    btn.classList.add('active');
    btn.innerHTML = `<img class="delete delete-img" src="assets/delete-active.svg" alt="delete button">
    <p class="delete">DELETE</p>`
  } else {
    btn.classList.remove('active');
    btn.innerHTML = `<img class="delete delete-img" src="assets/delete.svg" alt="delete button">
    <p class="delete">DELETE</p>`
  }
  btn.disabled = !allChecked;
}

function checkIfChecked() {
  var allCheckBoxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < allCheckBoxes.length; i++) {
    allCheckBoxes[i].disabled = allCheckBoxes[i].checked;
  }
}

function checkIfDeleteIsActive() {
  var allTaskCards = document.querySelectorAll('.task-card');
  for (var t = 0; t < allTaskCards.length; t++) {
    var allChecked = true;
    var deleteBtn = allTaskCards[t].querySelector('button');
    var checkPairs = allTaskCards[t].querySelectorAll('.check-pair');
    for (var i = 0; i < checkPairs.length; i++) {
      if (!checkPairs[i].childNodes[1].checked) {
        allChecked = false;
      }
    }
    checkIfAllChecked(allChecked, deleteBtn);
  }
}

function checkIfNoMoreCards() {
  if (!tasksListsSection.innerHTML) {
    tasksListsSection.innerHTML = `<h3 id="no-tasks-msg">No tasks yet! Create a new task list to get started.</h3>`
  }
}

function checkIfUrgent() {
  for (var i = 0; i < taskLists.length; i++) {
    if (taskLists[i].urgent) {
      var allTaskCards = document.querySelectorAll('.task-card');
      for (var j = 0; j < allTaskCards.length; j++) {
        activateUrgentIcon(taskLists[i], allTaskCards[j]);
      }
    }
  }
}

function checkStorage() {
  var noTasksMsg = document.getElementById('no-tasks-msg');
  if (localStorage.getItem('task lists') !== '[]' && localStorage.getItem('task lists') !== null) {
    noTasksMsg.remove();
    taskLists = JSON.parse(localStorage.getItem('task lists'));
    for (var g = 0; g < taskLists.length; g++) {
      taskLists[g] = new ToDoList(taskLists[g].id, taskLists[g].title, taskLists[g].urgent, taskLists[g].tasks);
    }
  }
}

function clearForm() {
  taskForm.reset();
  taskItemBox.innerHTML = '';
  disableAllButtons();
}

function deleteTaskCard(event) {
  if (event.target.classList.contains('delete') && !event.target.closest('button').disabled) {
    var targetCard = event.target.closest('.task-card');
    function findList(list) {
      return list.id == targetCard.id;
    }
    var targetList = taskLists.find(findList);
    targetCard.remove();
    targetList.deleteFromStorage();
  }
  checkIfNoMoreCards();
}

function deleteTaskItem(event) {
  if (event.target.classList.contains('delete')) {
    event.target.parentNode.remove();
  }
}

function disableAllButtons() {
  var buttons = document.querySelectorAll('button');
  buttons.forEach(function(button) {
    button.disabled = true;
  })
  filterBtn.disabled = false;
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

function filterByUrgency() {
  var urgentTaskLists = findUrgentLists();
  if (!filterBtn.classList.contains('active') && urgentTaskLists.length > 0) {
    populateCards(urgentTaskLists);
    filterBtn.classList.add('active');
  } else if (!filterBtn.classList.contains('active') && urgentTaskLists.length === 0) {
    tasksListsSection.innerHTML = `<h3>No urgent tasks yet!</h3>`
    filterBtn.classList.add('active');
  } else {
    populateCards(taskLists);
    filterBtn.classList.remove('active');
  }
}

function findUrgentLists() {
  var urgentTaskLists = [];
  for (var i = 0; i < taskLists.length; i++) {
    if (taskLists[i].urgent) {
      urgentTaskLists.push(taskLists[i]);
    }
  }
  return urgentTaskLists;
}

function fireOnLoad() {
  disableAllButtons();
  checkStorage();
  addTasksOnLoad();
  checkIfDeleteIsActive();
  checkIfUrgent();
}

function generateChecklistHTML(taskItems) {
  var checklistHTML = '';
  for (var j = 0; j < taskItems.length; j++) {
    taskItems[j] = new Task(taskItems[j].id, taskItems[j].content, taskItems[j].completed);
    var checkedStatus = taskItems[j].completed ? `checked="checked"` : '';
    checklistHTML += `<div class="check-pair">
      <input id=${taskItems[j].id} class="checkbox" type="checkbox" ${checkedStatus}><input id="${taskItems[j].id}b" class="item-inputs" type="text" value="${taskItems[j].content}">
    </div>`;
  }
  return checklistHTML;
}

function makeTaskCard(id, title, checklistHTML) {
  var taskCard = `<div id=${id} class="task-card">
    <input class="card-title" value="${title}">
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
    <div class="add-task-box">
      <input class="item-input-2 item-input" type="text" placeholder="add a task">
      <button class="add-button-2 add-button" type="button">+</button>
    </div>
  </div>`
  return taskCard;
}

function markUrgent(event) {
  if (event.target.classList.contains('urgent') && !event.target.classList.contains('active')) {
    event.target.classList.add('active');
    var targetCard = event.target.closest('.task-card');
    for (var i = 0; i < taskLists.length; i++) {
      if (taskLists[i].id == targetCard.id) {
        taskLists[i].updateToDo(taskLists[i].title, true);
      }
    }
  }
}

function populateCards(taskLists) {
  tasksListsSection.innerHTML = '';
  for (var i = 0; i < taskLists.length; i++) {
    var taskItems = taskLists[i].tasks;
    var checklistHTML = generateChecklistHTML(taskItems);
    var taskCard = makeTaskCard(taskLists[i].id, taskLists[i].title, checklistHTML);
    tasksListsSection.insertAdjacentHTML('afterbegin', taskCard);
    checkIfChecked();
    checkIfUrgent();
    checkIfDeleteIsActive();
  }
}

function removeAllCards() {
  var allCards = document.querySelectorAll('.task-card');
  allCards.forEach(function(card) {
    card.remove();
  })
}

function searchPartialString(zone, list, filteredLists) {
  var searchTerm = searchBar.value;
  if (searchTerm === zone.slice(0, searchTerm.length) && filteredLists.indexOf(list) === -1) {
    filteredLists.push(list);
  }
}

function searchLists(filteredLists, mainList) {
  mainList.forEach(function(list) {
    searchPartialString(list.title, list, filteredLists);
  })
}

function searchItems(filteredLists, mainList) {
  mainList.forEach(function(list) {
    list.tasks.forEach(function(task) {
      searchPartialString(task.content, list, filteredLists);
    })
  })
}

function searchUrgentTasks() {
  var searchSelector = document.getElementById('search-selector');
  var urgentLists = findUrgentLists();
  if (filterBtn.classList.contains('active') && searchBar.value) {
    var filteredLists = [];
    searchLists(filteredLists, urgentLists);
    searchItems(filteredLists, urgentLists);
    populateCards(filteredLists);
  } else if (filterBtn.classList.contains('active') && !searchBar.value) {
    populateCards(urgentLists);
  }
}

function searchTasks() {
  var searchSelector = document.getElementById('search-selector');
  var filteredLists = [];
  if (!filterBtn.classList.contains('active') && searchBar.value && searchSelector.value === 'all') {
    searchLists(filteredLists, taskLists);
    searchItems(filteredLists, taskLists);
    populateCards(filteredLists);
  } else if (!filterBtn.classList.contains('active') && searchBar.value && searchSelector.value === 'title') {
    searchLists(filteredLists, taskLists);
    populateCards(filteredLists);
  } else if (!filterBtn.classList.contains('active') && searchBar.value && searchSelector.value === 'tasks') {
    searchItems(filteredLists, taskLists);
    populateCards(filteredLists);
  } else if (!filterBtn.classList.contains('active')) {
    populateCards(taskLists);
  }
}

function updateCheckedData(list, task) {
  if (event.target.id === task.id) {
    list.updateTask(event.target.id, 'check');
    event.target.disabled = true;
  }
}
