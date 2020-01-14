class ToDoList {
  constructor(id, title, urgent, tasks) {
    this.id = id;
    this.title = title;
    this.urgent = urgent;
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

  updateTask(id, change, newTasks) {
    if (change === 'check') {
      for (var i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id === id && this.tasks[i].completed === false) {
          this.tasks[i].completed = true;
        }
      }
    } else if (change === 'content') {
      for (var i = 0; i < this.tasks.length; i++) {
        this.tasks[i].content = newTasks[i].content;
      }
    }
  }
}
