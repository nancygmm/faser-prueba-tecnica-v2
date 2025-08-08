import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Control de Tareas - Nancy Mazariegos';
  tasks: Task[] = [];
  showDialog = false;
  editingTask: Task | null = null;
  formTitle = '';
  formDuration: number | null = null;

  showBulkDialog = false;
  bulkText = '';

  addTask() {
    this.editingTask = null;
    this.formTitle = '';
    this.formDuration = null;
    document.body.style.overflow = 'hidden';
    this.showDialog = true;
  }

  openEditDialog(task: Task) {
    this.editingTask = { ...task };
    this.formTitle = task.title;
    this.formDuration = task.duration;
    document.body.style.overflow = 'hidden';
    this.showDialog = true;
  }

  saveFromDialog() {
    const duration = Number(this.formDuration ?? 0);
    const title = (this.formTitle ?? '').trim();
    if (this.editingTask) {
      const idx = this.tasks.findIndex(t => t.id === this.editingTask!.id);
      if (idx >= 0) this.tasks[idx] = { ...this.editingTask, title, duration };
    } else {
      const newTask: Task = { id: Date.now(), title, duration };
      this.tasks.push(newTask);
    }
    this.closeDialog();
  }

  deleteFromDialog() {
    if (!this.editingTask) return;
    this.tasks = this.tasks.filter(t => t.id !== this.editingTask!.id);
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog = false;
    this.editingTask = null;
    this.formTitle = '';
    this.formDuration = null;
    document.body.style.overflow = '';
  }

  openBulkDialog() {
    this.bulkText = '';
    document.body.style.overflow = 'hidden';
    this.showBulkDialog = true;
  }

  closeBulkDialog() {
    this.showBulkDialog = false;
    this.bulkText = '';
    document.body.style.overflow = '';
  }

  processBulk() {
    const lines = (this.bulkText || '')
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const ts = Date.now();
    const parsed: Task[] = [];

    lines.forEach((line, i) => {
      const match = line.match(/\|\s*(\d+)\s*$/);
      const duration = match ? parseInt(match[1], 10) : 10;
      const title = match ? line.slice(0, match.index).trim() : line;
      if (title) parsed.push({ id: ts + i, title, duration });
    });

    if (parsed.length) this.tasks = [...this.tasks, ...parsed];
    this.closeBulkDialog();
  }
}
