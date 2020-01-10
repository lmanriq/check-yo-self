class Task {
  constructor (content) {
    this.content = content;
    this.completed = false;
  }

  markCompleted() {
    this.completed = true;
  }
}
