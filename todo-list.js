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
    for (var i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id === id) {
        this.tasks[i].content = content;
        this.tasks[i].completed = true;
      }
    }
  }
}
