class Task {
  constructor (id) {
    this.id = id;
    this.title = '';
    this.completed = false;
  }

  markCompleted() {
    this.completed = true;
  }
}
