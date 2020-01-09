class ToDoList {
  constructor(id) {
    this.id = id;
    this.title = '';
    this.urgent = false;
    this.tasks = [];
  }

  saveToStorage() {
    window.localStorage.setItem(this);
  }

  deleteFromStorage() {
    window.localStorage.removeItem(this);
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
