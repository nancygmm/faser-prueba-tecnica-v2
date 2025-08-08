import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AddTaskDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Control de Tareas - Nancy Mazariegos';
  tasks: Task[] = [];
  showDialog = false;
  selectedTask: Task | null = null;

  addTask() {
    this.showDialog = true;
  }

  onTaskAdded(newTask: Task) {
    this.tasks.push(newTask);
    this.showDialog = false;
  }

  onDialogClosed() {
    this.showDialog = false;
  }

  selectTask(task: Task) {
    this.selectedTask = task;
  }

  deleteTask() {
    if (this.selectedTask) {
      this.tasks = this.tasks.filter(task => task.id !== this.selectedTask!.id);
      this.selectedTask = null;
    }
  }

  isTaskSelected(task: Task): boolean {
    return this.selectedTask?.id === task.id;
  }
}
