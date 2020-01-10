class Task {
  constructor (id, content, completed) {
    this.id = id;
    this.content = content;
    this.completed = completed;
  }

  markCompleted() {
    this.completed = true;
  }
}
