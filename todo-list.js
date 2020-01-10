class ToDoList {
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.urgent = false;
    this.tasks = tasks;
  }

  saveToStorage() {
    taskLists.push(this);
    window.localStorage.setItem('task lists', JSON.stringify(taskLists));
  }

  deleteFromStorage() {
    taskLists.splice(taskLists.indexOf(this), 1)
    window.localStorage.setItem('task lists', JSON.stringify(taskLists));
  }

  updateToDo(newTitle, urgency) {
    this.title = newTitle;
    this.urgent = urgency;
  }

  updateTask(id, content, completed) {
    this.tasks.forEach(function(task) {
      if (task.id === id) {
        task.content = content;
        task.completed = true;
      }
    })
  }
}
